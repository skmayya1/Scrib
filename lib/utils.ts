import ffmpeg from "fluent-ffmpeg";
import { Readable } from "stream";

export async function getAudioDuration(buffer: Buffer): Promise<number> {
return new Promise((resolve, reject) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  ffmpeg(stream)
    .format("wav") 
    .ffprobe((err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const duration = metadata.format.duration ?? 0;
        resolve(duration);
      }
    });
});
}
