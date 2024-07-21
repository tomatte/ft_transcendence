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
    
    @classmethod
    def convert_to_array(cls, matches):
        result = []
        for match_id, match in matches.items():
            match["id"] = match_id
            result.append(match)
        return result
    
    @classmethod
    def get(cls, match_id):
        return redis.get_map("global_matches", match_id)
    
    @classmethod
    def set(cls, match_id, match):
        return redis.set_map("global_matches", match_id, match)
    
    @classmethod
    def set_phase_running(cls, match_id):
        match = cls.get(match_id)
        match["phase"] = "running"
        cls.set(match_id, match)