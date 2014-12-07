_scores = (function() {
    levels = {}

    function getLevelScoreStorage(id) {
        var scoreObj = ls_get(id);
        if (scoreObj !== null) {
            levels[id] = scoreObj;
        } else {
            levels[id] = {
                time: null, 
                tries: -1, 
                udpated: true, 
                worldAvg: 0.0,
            }
            ls_set(id, levels[id]);
        }
        return levels[id];
    }
    
    function getLevel(id) {
        if (id in levels) {
            return levels[id]
        } else {
            return getLevelScoreStorage(id);
        }
    }
    
    function levelComplete(id, time) {
        var level = getLevel(id);
        level.tries++;
        if (level.time === null || time < level.time) {
            level.time = time;
            level.updated = false;
            makeRequest('http://50.97.175.55:32619/level/complete', 'POST', 
            {
                level: id.toString()
                , time: time
                , user: $.userid
            },
            function(response, error) {
                if (error != false) {
                    console.log("Error making user report request");
                    return
                } else {
                    // TODO save un-updated levels
                    level.updated = true;
                    ls_set(level.id, level);
                }
            }
    );
        }
        ls_set(level.id, level);
    }
    
    function getLevelStats(id, callback) {
        var level = getLevel(id);
        makeRequest('http://50.97.175.55:32619/level/stats', 'POST',
                {
                    id: id.toString()
                },
                function(response, error) {
                    if (error != false) {
                        console.log("Error making level stats request");
                        return;
                    }
                    if (response.error != '') {
                        console.log("Error getting levels stats: ", response.error);
                        return;
                    }
                    level.worldAvg = response.data.avg;
                    level.tries = response.data.num;
                    // save stats data in case user plays offline
                    ls_set(id, level)
                    if ($.level.id == id) {
                        callback(level);
                    }
                }
        );
    }
    
    return {
        get: getLevel,
        levelComplete: levelComplete,
        getLevelStats: getLevelStats,
    }
})();
