import React, { ChangeEvent, useCallback, useState, useEffect } from "react";
import { httpClient } from "./utils/httpClient";
import { YTResponse, YTVideoDetail } from "./utils/type";
import dayjs from "dayjs";
import { formatDuration, getLastSeen } from "./utils/common";
import { StatusBadge } from "./components/ui";
import { saveAs } from "file-saver";

interface YTDownload {
  index: number;
  title: string;
  videoId: string;
  videoUrl: string;
  lengthSeconds: string;
  thumbnail: string;
  status: "PENDING" | "PROGRESS" | "SUCCESS" | "ERROR";
  timestamp: string;
}

const App: React.FC = () => {
  const [url, setUrl] = useState("");
  const [ytDownloads, setYTDownloads] = useState<YTDownload[]>([]);

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleClearUrl = () => {
    setUrl("");
  };

  const processDownload = useCallback(async (tasks: YTDownload[]) => {
    const pendingTaskIndex = tasks.findIndex((yt) => yt.status === "PENDING");
    if (pendingTaskIndex === -1) return;

    for (let i = 0; i < tasks.length; i++) {
      const yt = tasks[i];
      if (yt.status !== "PENDING") continue;

      try {
        // Update status to "PROGRESS"
        setYTDownloads((prev) =>
          prev.map((item, idx) => (idx === i ? { ...item, status: "PROGRESS" } : item))
        );

        // Perform download
        const { title, videoUrl } = yt;
        const body = { url: videoUrl };
        const response = await httpClient.post("/download", body);
        const blob = new Blob([response.data], { type: "audio/mpeg" });
        saveAs(blob, `${title}.mp3`);

        // Update status to "SUCCESS"
        setYTDownloads((prev) =>
          prev.map((item, idx) => (idx === i ? { ...item, status: "SUCCESS" } : item))
        );
      } catch (err) {
        console.error("Download error:", err);

        // Update status to "ERROR"
        setYTDownloads((prev) =>
          prev.map((item, idx) => (idx === i ? { ...item, status: "ERROR" } : item))
        );
      }
    }
  }, []);

  const handleDownload = useCallback(async () => {
    try {
      const host = new URL(url).host;
      const isValidUrl = host === "www.youtube.com" || host === "music.youtube.com";
      if (!url || !isValidUrl) {
        alert("Invalid URL");
        return;
      }
      // Clear input video url
      setUrl("");

      const body = { url };
      const response = await httpClient.post("metadata", body);
      const result: YTResponse<YTVideoDetail> = response.data;
      if (!result.data) return;

      const { title, videoId, video_url, lengthSeconds, thumbnails } = result.data;
      const newTaskDownload: YTDownload = {
        index: ytDownloads.length + 1,
        title: title,
        videoId: videoId,
        videoUrl: video_url,
        lengthSeconds: lengthSeconds,
        thumbnail: Array.isArray(thumbnails) && thumbnails.length > 0 ? thumbnails[0].url : "",
        status: "PENDING",
        timestamp: dayjs().format(),
      };
      const tasks = [...ytDownloads, newTaskDownload];
      setYTDownloads(tasks);
      processDownload(tasks);
    } catch (err) {
      console.error("Metadata error:", err);
    }
  }, [processDownload, url, ytDownloads]);

  useEffect(() => {
    httpClient.get("ping");
  }, []);

  return (
    <div className="flex flex-col items-center h-screen p-4">
      <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
        Youtube Downloader
      </h2>

      <div className="flex w-full max-w-3xl mt-8 border border-gray-300 rounded-full shadow-md hover:shadow-lg focus-within:shadow-lg">
        <input
          type="text"
          className="flex-grow px-4 py-2 text-gray-700 rounded-l-full focus:outline-none"
          placeholder="Search"
          inputMode="url"
          value={url}
          onChange={handleUrlChange}
        />

        {url && (
          <div className="cursor-pointer flex items-center mx-2" onClick={handleClearUrl}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </div>
        )}

        <button className="px-4 py-2 bg-gray-100 rounded-r-full" onClick={handleDownload}>
          🔍
        </button>
      </div>

      <br />

      <ul role="list" className="w-full max-w-3xl divide-y divide-gray-100 overflow-auto">
        {ytDownloads
          .slice()
          .reverse()
          .map((data, index) => (
            <li key={index} className="flex justify-between gap-x-6 px-1 py-2">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <div className="flex gap-2">
                    <div className="max-w-[80px]">
                      <img src={data.thumbnail} alt="thumbnail" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm/6 font-semibold text-gray-900 line-clamp-1">
                        {data.title}
                      </p>
                      <p className="mt-1 truncate text-xs/5 text-gray-500 line-clamp-1">
                        {data.videoUrl}
                      </p>
                      <p className="mt-1 truncate text-xs/5 text-gray-500 line-clamp-1">
                        {formatDuration(Number(data.lengthSeconds))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <div className="text-sm/6 text-gray-900">{StatusBadge(data.status)}</div>
                <p className="mt-1 text-xs/5 text-gray-500">
                  Last seen <time dateTime={data.timestamp}>{getLastSeen(data.timestamp)}</time>
                </p>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default App;
