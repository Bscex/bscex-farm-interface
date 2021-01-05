
contract BSCXNieuThachSanh is Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // Info of each user.
    struct UserInfo {
        uint256 amount;     // How many LP tokens the user has provided.
        uint256 rewardDebt; // Reward debt. See explanation below.
        uint256 rewardDebtAtBlock; // the last block user stake
        uint256 locked;
        uint256 lastUnlockBlock;
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 lpToken;           // Address of LP token contract.
        IERC20 rewardToken;       // Address of reward token contract.
        uint256 lastRewardBlock;  // Last block number that Reward distribution occurs.
        uint256 accRewardPerShare; // Accumulated Reward per share, times 1e12. See below.
        uint256 rewardPerBlock;
        uint256 percentLockBonusReward;
        uint256 percentForDev;
        uint256 burnPercent;
        uint256 finishBonusAtBlock;
        uint256 startBlock;
        uint256[] rewardMultiplier;
        uint256[] halvingAtBlock;
    }

    mapping(uint256 => uint256) private totalLocks;

    // The BSCX TOKEN!
    BSCXToken public bscx;
    // Dev address.
    address public devaddr;
    // BSCX tokens created per block.
    // Bonus muliplier for early BSCX makers.
    uint256[] public REWARD_MULTIPLIER = [8, 8, 8, 4, 4, 4, 2, 2, 2, 1];
    uint256[] public HALVING_AT_BLOCK; // init in constructor function
    uint256 public FINISH_BONUS_AT_BLOCK;

    // The block number when BSCX mining starts.
    uint256 public START_BLOCK;

    uint256 public constant REWARD_PER_BLOCK = 1000000000000000000; // 1000000000000000000
    uint256 public constant PERCENT_LOCK_BONUS_REWARD = 75; // lock 75% of bounus reward in 1 year
    uint256 public constant PERCENT_FOR_DEV = 20; // 10% reward for dev

    uint256 public burnPercent = 0; // init 0% burn bscx

    uint256 public lockFromBlock;
    uint256 public lockToBlock;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    mapping(address => uint256) public poolId1; // poolId1 count from 1, subtraction 1 before using with poolInfo
    // Info of each user that stakes LP tokens. pid => user address => info
    mapping (uint256 => mapping (address => UserInfo)) public userInfo;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event SendBSCXReward(address indexed user, uint256 indexed pid, uint256 amount, uint256 lockAmount);
    event Lock(address indexed to, uint256 value);

    constructor(
        BSCXToken _bscx,
        address _devaddr,
    ) public {
        bscx = _bscx;
        devaddr = _devaddr;

        lockFromBlock = block.number + 10512000;
        lockToBlock = lockFromBlock + 10512000;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // Add a new lp to the pool. Can only be called by the owner.
    function add(
        IERC20 _rewardToken,
        IERC20 _lpToken,
        uint256 _startBlock,
        uint256 _rewardPerBlock,
        uint256 _percentLockBonusReward,
        uint256 _percentForDev,
        uint256 _burnPercent,
        uint256 _halvingAfterBlock,
        uint256[] _rewardMultiplier,
        bool _withUpdate
    ) public onlyOwner {
        require(poolId1[address(_lpToken)] == 0, "BSCXNieuThachSanh::add: lp is already in pool");
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 lastRewardBlock = block.number > _startBlock ? block.number : _startBlock;
        poolId1[address(_lpToken)] = poolInfo.length + 1;

        uint256[] public HALVING_AT_BLOCK;
        for (uint256 i = 0; i < _rewardMultiplier.length - 1; i++) {
            uint256 halvingAtBlock = _halvingAfterBlock.mul(i + 1).add(_startBlock);
            HALVING_AT_BLOCK.push(halvingAtBlock);
        }
        uint256 FINISH_BONUS_AT_BLOCK = _halvingAfterBlock.mul(_rewardMultiplier.length - 1).add(_startBlock);
        HALVING_AT_BLOCK.push(uint256(-1));

        poolInfo.push(PoolInfo({
            lpToken: _lpToken,
            rewardToken: _rewardToken,
            lastRewardBlock: lastRewardBlock,
            accRewardPerShare: 0,
            startBlock: _startBlock,
            rewardPerBlock: _rewardPerBlock,
            percentLockBonusReward: _percentLockBonusReward,
            percentForDev: _percentForDev,
            burnPercent: _burnPercent,
            rewardMultiplier: _rewardMultiplier,
            finishBonusAtBlock: FINISH_BONUS_AT_BLOCK,
            halvingAtBlock: HALVING_AT_BLOCK
        }));
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 forBurn;
        uint256 forDev;
        uint256 forFarmer;
        (forBurn, forDev, forFarmer) = getPoolReward(_pid);

        if (forBurn > 0) {
            bscx.burn(forBurn);
        }

        if (forDev > 0) {
            // Mint unlocked amount for Dev
            pool.rewardToken.transfer(devaddr, forDev.mul(100 - pool.percentLockBonusReward).div(100));
            //For more simple, I lock reward for dev if mint reward in bonus time
            farmLock(devaddr, forDev.mul(pool.percentLockBonusReward).div(100));
        }
        pool.accRewardPerShare = pool.accRewardPerShare.add(forFarmer.mul(1e12).div(lpSupply));
        pool.lastRewardBlock = block.number;
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(
        uint256 _from,
        uint256 _to,
        uint256 _halvingAtBlock,
        uint256 _rewardMultiplier,
        uint256 _startBlock
    ) public view returns (uint256) {
        uint256 result = 0;
        if (_from < _startBlock) return 0;

        for (uint256 i = 0; i < _halvingAtBlock.length; i++) {
            uint256 endBlock = _halvingAtBlock[i];

            if (_to <= endBlock) {
                uint256 m = _to.sub(_from).mul(_rewardMultiplier[i]);
                return result.add(m);
            }

            if (_from < endBlock) {
                uint256 m = endBlock.sub(_from).mul(_rewardMultiplier[i]);
                _from = endBlock;
                result = result.add(m);
            }
        }

        return result;
    }

    function getPoolReward(uint256 _pid) public view returns (uint256 forBurn, uint256 forDev, uint256 forFarmer) {
        PoolInfo pool = poolInfo[_pid];

        uint256 multiplier = getMultiplier(pool.from, block.number, pool.halvingAtBlock, pool.rewardMultiplier, pool.startBlock);
        uint256 amount = multiplier.mul(pool.rewardPerBlock);
        uint256 rewardCanAlloc = pool.rewardToken.balanceOf(address(this));

        if (rewardCanAlloc < amount) {
            forBurn = 0;
            forDev = 0;
            forFarmer = rewardCanAlloc;
        }
        else {
            forBurn = amount.mul(pool.burnPercent).div(100);
            forDev = amount.mul(pool.percentForDev).div(100);
            forFarmer = amount.mul(100 - pool.burnPercent - pool.percentForDev).div(100);
        }
    }

    // View function to see pending BSCXs on frontend.
    function pendingReward(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accBSCXPerShare = pool.accBSCXPerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && lpSupply > 0) {
            uint256 bscxForFarmer;
            (, , bscxForFarmer) = getPoolReward(pool.lastRewardBlock, block.number, pool.allocPoint);
            accBSCXPerShare = accBSCXPerShare.add(bscxForFarmer.mul(1e12).div(lpSupply));

        }
        return user.amount.mul(accBSCXPerShare).div(1e12).sub(user.rewardDebt);
    }

    function claimReward(uint256 _pid) public {
        updatePool(_pid);
        _harvest(_pid);
    }

    // lock 75% of reward if it come from bounus time
    function _harvest(uint256 _pid) internal {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        if (user.amount > 0) {
            uint256 pending = user.amount.mul(pool.accBSCXPerShare).div(1e12).sub(user.rewardDebt);
            uint256 masterBal = bscx.balanceOf(address(this));

            if (pending > masterBal) {
                pending = masterBal;
            }

            if(pending > 0) {
                bscx.transfer(msg.sender, pending.mul(100 - PERCENT_LOCK_BONUS_REWARD).div(100));
                uint256 lockAmount = pending.mul(PERCENT_LOCK_BONUS_REWARD).div(100);
                farmLock(msg.sender, lockAmount);

                user.rewardDebtAtBlock = block.number;

                emit SendBSCXReward(msg.sender, _pid, pending, lockAmount);
            }

            user.rewardDebt = user.amount.mul(pool.accBSCXPerShare).div(1e12);
        }
    }

    // Deposit LP tokens to BSCXNieuThachSanh for BSCX allocation.
    function deposit(uint256 _pid, uint256 _amount) public {
        require(_amount > 0, "BSCXNieuThachSanh::deposit: amount must be greater than 0");

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);
        _harvest(_pid);
        pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);
        if (user.amount == 0) {
            user.rewardDebtAtBlock = block.number;
        }
        user.amount = user.amount.add(_amount);
        user.rewardDebt = user.amount.mul(pool.accBSCXPerShare).div(1e12);
        emit Deposit(msg.sender, _pid, _amount);
    }

    // Withdraw LP tokens from BSCXNieuThachSanh.
    function withdraw(uint256 _pid, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "BSCXNieuThachSanh::withdraw: not good");

        updatePool(_pid);
        _harvest(_pid);

        if(_amount > 0) {
            user.amount = user.amount.sub(_amount);
            pool.lpToken.safeTransfer(address(msg.sender), _amount);
        }
        user.rewardDebt = user.amount.mul(pool.accBSCXPerShare).div(1e12);
        emit Withdraw(msg.sender, _pid, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        pool.lpToken.safeTransfer(address(msg.sender), user.amount);
        emit EmergencyWithdraw(msg.sender, _pid, user.amount);
        user.amount = 0;
        user.rewardDebt = 0;
    }

    // Safe bscx transfer function, just in case if rounding error causes pool to not have enough BSCXs.
    function safeBSCXTransfer(address _to, uint256 _amount) internal {
        uint256 bscxBal = bscx.balanceOf(address(this));
        if (_amount > bscxBal) {
            bscx.transfer(_to, bscxBal);
        } else {
            bscx.transfer(_to, _amount);
        }
    }

    // Update dev address by the previous dev.
    function dev(address _devaddr) public {
        require(msg.sender == devaddr, "dev: wut?");
        devaddr = _devaddr;
    }

    function getNewRewardPerBlock(uint256 pid1) public view returns (uint256) {
        uint256 multiplier = getMultiplier(block.number -1, block.number);
        if (pid1 == 0) {
            return multiplier.mul(REWARD_PER_BLOCK);
        }
        else {
            return multiplier
                .mul(REWARD_PER_BLOCK)
                .mul(poolInfo[pid1 - 1].allocPoint)
                .div(totalAllocPoint);
        }
    }

    function setBurnPercent(uint256 _burnPercent) public onlyOwner {
        require(_burnPercent > burnPercent, "error: set burn percent");
        burnPercent = _burnPercent;
    }

    function totalLock() public view returns (uint256) {
        return _totalLock;
    }

    function lockOf(address _holder) public view returns (uint256) {
        return _locks[_holder];
    }

    function lastUnlockBlock(address _holder) public view returns (uint256) {
        return _lastUnlockBlock[_holder];
    }

    function farmLock(address _holder, uint256 _amount) internal {
        require(_holder != address(0), "ERC20: lock to the zero address");
        require(_amount <= bscx.balanceOf(address(this)), "ERC20: lock amount over blance");
        _locks[_holder] = _locks[_holder].add(_amount);
        _totalLock = _totalLock.add(_amount);
        if (_lastUnlockBlock[_holder] < lockFromBlock) {
            _lastUnlockBlock[_holder] = lockFromBlock;
        }
        emit Lock(_holder, _amount);
    }

    function canUnlockAmount(address _holder) public view returns (uint256) {
        if (block.number < lockFromBlock) {
            return 0;
        }
        else if (block.number >= lockToBlock) {
            return _locks[_holder];
        }
        else {
            uint256 releaseBlock = block.number.sub(_lastUnlockBlock[_holder]);
            uint256 numberLockBlock = lockToBlock.sub(_lastUnlockBlock[_holder]);
            return _locks[_holder].mul(releaseBlock).div(numberLockBlock);
        }
    }

    function unlock() public {
        require(_locks[msg.sender] > 0, "ERC20: cannot unlock");

        uint256 amount = canUnlockAmount(msg.sender);
        // just for sure
        if (amount > bscx.balanceOf(address(this))) {
            amount = bscx.balanceOf(address(this));
        }
        bscx.transfer(msg.sender, amount);
        _locks[msg.sender] = _locks[msg.sender].sub(amount);
        _lastUnlockBlock[msg.sender] = block.number;
        _totalLock = _totalLock.sub(amount);
    }


    function setTransferBurnRate(uint256 _tranferBurnRate) public onlyOwner {
        bscx.setTransferBurnRate(_tranferBurnRate);
    }

    // In some circumstance, we should not burn BSCX on transfer, eg: Transfer from owner to distribute bounty, from depositing to swap for liquidity
    function addTransferBurnExceptAddress(address _transferBurnExceptAddress) public onlyOwner {
        bscx.addTransferBurnExceptAddress(_transferBurnExceptAddress);
    }

    function removeTransferBurnExceptAddress(address _transferBurnExceptAddress) public onlyOwner {
        bscx.removeTransferBurnExceptAddress(_transferBurnExceptAddress);
    }
}
