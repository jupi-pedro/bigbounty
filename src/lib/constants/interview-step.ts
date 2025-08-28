export enum InterviewStepType {
  Assessment = "Assessment",
  PhoneCall = "Phone Call",
  VideoCall = "Video Call",
}

export enum InterviewProcessStatus {
  InProgress = "In Progress",
  Offered = "Offered",
  Declined = "Declined",
}

export const interviewStepTypes = [
  { value: InterviewStepType.Assessment, label: "Assessment" },
  { value: InterviewStepType.PhoneCall, label: "Phone Call" },
  { value: InterviewStepType.VideoCall, label: "Video Call" },
]

export const interviewProcessStatuses = [
  { value: InterviewProcessStatus.InProgress, label: "In Progress" },
  { value: InterviewProcessStatus.Offered, label: "Offered" },
  { value: InterviewProcessStatus.Declined, label: "Declined" },
]