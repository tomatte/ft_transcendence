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
        return cls.convert_to_array(running)
    
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
        return cls.convert_to_array(ready)
    
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
    def set_phase(cls, match_id, phase):
        match = cls.get(match_id)
        match["phase"] = phase
        cls.set(match_id, match)
        
    @classmethod
    def get_entities(cls, match_id):
        match = cls.get(match_id)
        return {
            "player_left": match["player_left"],
            "player_right": match["player_right"],
            "ball": match["ball"]
        }
        
    @classmethod
    def set_entities(cls, match_id, entities):
        match = cls.get(match_id)
        match["player_left"] = entities["player_left"]
        match["player_right"] = entities["player_right"]
        match["ball"] = entities["ball"]
        cls.set(match_id, match)