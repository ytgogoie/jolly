
from flask import Flask, render_template, request, jsonify, send_file
from utils import get_video_info, download_video
import os

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/fetch-info", methods=["POST"])
def fetch_info():
    url = request.form.get("url")
    if not url:
        return jsonify({"error": "No URL provided"}), 400

    try:
        video_info = get_video_info(url)
        return jsonify(video_info)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/download", methods=["POST"])
def download():
    url = request.form.get("url")
    format_id = request.form.get("format")
    if not url or not format_id:
        return "Invalid request", 400

    try:
        result = download_video(url, format_id)
        filepath = result['filepath']
        return send_file(filepath, as_attachment=True)
    except Exception as e:
        return str(e), 500

if __name__ == "__main__":
    app.run(debug=True)
