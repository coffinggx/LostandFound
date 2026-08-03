import requests

users = [
    {
        "email": "bibash.bk@example.com",
        "username": "bibashbk",
        "password": "Bibash@123",
        "fullname": "Bibash BK",
        "phone": "9841000011",
        "department": "BEIT"
    },
    {
        "email": "sudip.paudel@example.com",
        "username": "sudipp",
        "password": "Sudip@123",
        "fullname": "Sudip Paudel",
        "phone": "9841000012",
        "department": "BE COMPUTER"
    },
    {
        "email": "sushil.gaire@example.com",
        "username": "sushilg",
        "password": "Sushil@123",
        "fullname": "Sushil Gaire",
        "phone": "9841000013",
        "department": "BE SOFTWARE"
    },
    {
        "email": "subash.oli@example.com",
        "username": "subasho",
        "password": "Subash@123",
        "fullname": "Subash Oli",
        "phone": "9841000014",
        "department": "BE COMPUTER"
    }
]

for user in users:
    r = requests.post("http://localhost:8000/api/v1/user/register", json=user)
    print(r.status_code, r.json())
