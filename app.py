from flask import Flask, request, jsonify, send_file
from pytube import YouTube
import os

app = Flask(__name__)

# Directory to store downloaded videos
download_folder = "downloads"
os.makedirs(download_folder, exist_ok=True)

@app.route('/video_info', methods=['GET'])
def get_video_info():
    url = request.args.get('url')
    if not url:
        return jsonify({"error": "URL parameter is required"}), 400
    
    try:
        yt = YouTube(url)
        video_info = {
            "title": yt.title,
            "thumbnail": yt.thumbnail_url,
            "streams": [{
                "itag": stream.itag,
                "resolution": stream.resolution if stream.resolution else "Audio Only",
                "mime_type": stream.mime_type
            } for stream in yt.streams.filter(progressive=True) | yt.streams.filter(only_audio=True)]
        }
        return jsonify(video_info)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/download', methods=['GET'])
def download_video():
    url = request.args.get('url')
    itag = request.args.get('itag')
    
    if not url or not itag:
        return jsonify({"error": "Both URL and itag parameters are required"}), 400
    
    try:
        yt = YouTube(url)
        stream = yt.streams.get_by_itag(int(itag))
        if not stream:
            return jsonify({"error": "Invalid itag"}), 400
        
        safe_title = "".join(c for c in yt.title if c.isalnum() or c in (' ', '_')).rstrip()
        file_extension = "mp4" if "video" in stream.mime_type else "mp3"
        file_path = os.path.join(download_folder, f"{safe_title}.{file_extension}")
        stream.download(output_path=download_folder, filename=f"{safe_title}.{file_extension}")
        
        return send_file(file_path, as_attachment=True)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
