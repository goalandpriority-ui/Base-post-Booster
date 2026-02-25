// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BasePostBooster {
    struct Boost {
        address user;
        string postUrl;
        uint256 category; // 0:Trending,1:Meme,2:Alpha,3:NFT,4:General
        uint256 duration; // in hours
        uint256 price; // fixed ETH price
        uint256 endTime;
    }

    uint256 constant MAX_LEADERBOARD = 3;

    mapping(uint256 => Boost[]) public categoryBoosts;

    // Duration fixed price: 1h,6h,24h
    uint256[3] public durationPrice = [0.001 ether, 0.002 ether, 0.003 ether];

    function boostPost(string memory postUrl, uint256 category, uint256 durationIndex) external payable {
        require(category <= 4, "Invalid category");
        require(durationIndex <= 2, "Invalid duration");
        require(msg.value == durationPrice[durationIndex], "Incorrect ETH amount");

        uint256 durationHours = durationIndex == 0 ? 1 : durationIndex == 1 ? 6 : 24;

        Boost memory newBoost = Boost({
            user: msg.sender,
            postUrl: postUrl,
            category: category,
            duration: durationHours,
            price: msg.value,
            endTime: block.timestamp + (durationHours * 1 hours)
        });

        Boost[] storage leaderboard = categoryBoosts[category];

        if (leaderboard.length < MAX_LEADERBOARD) {
            leaderboard.push(newBoost);
        } else {
            // Simple push down logic: replace oldest
            if (block.timestamp >= leaderboard[0].endTime) {
                leaderboard[0] = newBoost;
            } else {
                leaderboard[0] = newBoost;
            }
        }
    }

    function getLeaderboard(uint256 category) external view returns (Boost[] memory) {
        return categoryBoosts[category];
    }
}
