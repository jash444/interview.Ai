const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");

const DEFAULT_FFMPEG = "D:\\AI\\ffmpeg-8.1.2-essentials_build\\bin\\ffmpeg.exe";
const DEFAULT_WHISPER = "D:\\AI\\whisper-cublas-12.4.0-bin-x64\\Release\\whisper-cli.exe";
const DEFAULT_MODEL = "D:\\AI\\whisper-cublas-12.4.0-bin-x64\\Release\\ggml-base.en.bin";

function resolveExecutable(candidatePath, fallback) {
  if (!candidatePath) {
    return fallback;
  }

  const normalizedPath = candidatePath.replace(/^['"]|['"]$/g, "");

  if (normalizedPath && fs.existsSync(normalizedPath)) {
    return normalizedPath;
  }

  return normalizedPath || fallback;
}

function speechToText(webmPath) {
    console.log("Loaded whisperService:", __filename);
  return new Promise((resolve, reject) => {
    const inputPath = path.isAbsolute(webmPath) ? path.resolve(webmPath) : path.resolve(path.join(__dirname, "..", webmPath));
    const wavPath = inputPath.replace(/\.webm$/i, ".wav");

    const ffmpegPath = resolveExecutable(process.env.FFMPEG_PATH || DEFAULT_FFMPEG, DEFAULT_FFMPEG);
    const whisperPath = resolveExecutable(process.env.WHISPER_PATH || DEFAULT_WHISPER, DEFAULT_WHISPER);
    const modelPath = resolveExecutable(process.env.WHISPER_MODEL_PATH || DEFAULT_MODEL, DEFAULT_MODEL);

    console.log("WEBM:", inputPath);
    console.log("WAV :", wavPath);
    console.log("FFmpeg:", ffmpegPath);

    execFile(ffmpegPath, ["-y", "-i", inputPath, wavPath], { windowsHide: true }, (err, stdout, stderr) => {
      if (err) {
        const message = stderr || stdout || err.message;
        console.error("FFmpeg Error:", message);
        return reject(new Error(message));
      }

      execFile(whisperPath, ["-m", modelPath, "-f", wavPath], { windowsHide: true }, (err, stdout, stderr) => {
        if (err) {
          const message = stderr || stdout || err.message;
          console.error("Whisper Error:", message);
          return reject(new Error(message));
        }

        resolve(stdout.trim());
      });
    });
  });
}

module.exports = speechToText;