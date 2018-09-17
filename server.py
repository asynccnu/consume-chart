from flask import Flask, request, send_file

app = Flask(__name__)

@app.route("/")
def index():
    return send_file("template/home.html")

if __name__ == '__main__':
    app.run()
