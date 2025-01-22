import dayjs from "dayjs";

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60); // คำนวณจำนวนนาที
  const remainingSeconds = seconds % 60; // คำนวณวินาทีที่เหลือ
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`; // เพิ่ม 0 ข้างหน้าถ้าวินาทีมีเพียงหลักเดียว
};

export const getLastSeen = (timestamp: string | Date) => {
  const now = dayjs(); // เวลาปัจจุบัน
  const past = dayjs(timestamp); // เวลาที่ต้องการเปรียบเทียบ
  const diffInSeconds = now.diff(past, "second"); // ความต่างในหน่วยวินาที
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`; // หากน้อยกว่า 1 นาที
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`; // หากน้อยกว่า 1 ชั่วโมง
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`; // หากน้อยกว่า 1 วัน
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`; // หากมากกว่า 1 วัน
  }
};
