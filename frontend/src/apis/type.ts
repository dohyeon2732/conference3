export type Time = {
  slice(arg0: number, arg1: number): unknown;
  hour: number;
  minute: number;
  second: number;
  nano: number;
};

export type Schedule = {
  scheduleId: number;
  scheduleName: string;
  roomId: number;
  roomName: string;
  userId: number;
  DeptId:number;
  userName: string;
  scheduleDate: string; // yyyy-MM-dd
  startTime: string;
  endTime: string;
  schedulePeople: number;
};


