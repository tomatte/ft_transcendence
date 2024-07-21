from my_redis import redis_client as redis

class MatchState:
    @classmethod
    def get_all(cls):
        return redis.get_map_all("global_matches")
    
    @classmethod
    def get_running(cls):
        matches = cls.get_all()
        running = {}
        for match_id, match in matches.items():
            if match["phase"] == "running":
                running[match_id] = match
        return running
    
    @classmethod
    def get_ready(cls):
        matches = cls.get_all()
        ready = {}
        for match_id, match in matches.items():
            if match["phase"] != "start":
                continue
            if match["player_left"]["ready"] == False:
                continue
            if match["player_right"]["ready"] == False:
                continue
            ready[match_id] = match
        return ready