from flask import Flask, request, send_file, render_template
from flask_cors import CORS
import tempfile
from text2speech import speak
from speech2text import speech2text
from groq_service import execute

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template("index.html")

@app.route ("/process-audio", methods=['POST'])
def process_audio_data():
    audio_data = request.files["audio"].read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
        temp_audio.write(audio_data)
        temp_audio.flush()
    text = speech2text(temp_audio.name)
    generated_answer = execute(f"Please answer to the question: {text}")
    #API CALLS, FROM TEXT

    generated_speech = speak(generated_answer)

    return send_file(generated_speech, mimetype='audio/mpeg')
if __name__ == '__main__':
    app.run(debug=True, port=8080)