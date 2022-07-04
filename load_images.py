import requests
import json

with open("./bandit_leverset.json", "r") as f:
    data = json.load(f)
    for photoset in data:
        photoset_id = photoset["id"]
        photos = [{"photo_id": image["id"]} for image in photoset["images"]]

        print(
            requests.post(
                "http://0.0.0.0:8000/v1/bandit/initialize",
                json={"photos": photos, "photoset_id": photoset_id, "overwrite": True},
            ).text
        )
