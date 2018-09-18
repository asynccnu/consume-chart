from flask import Flask, request, send_file

app = Flask(__name__)

@app.route("/api/consumechart/")
def index():
    return send_file("template/home.html")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port = 8080)
