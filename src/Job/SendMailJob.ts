import  Queue from "bull";
import transporter from "../helpers/send_mail";

const emailQueue = new Queue("sendMail", {
    redis: {
        port: 6379,
        host: "localhost"
    }
});

emailQueue.process(async(job)=>{
    const {to, subject, text} = job.data;

    await transporter.sendMail({
        from: "myma_ilsender@hotmail.com",
        subject,
        to,
        text
    });
});

emailQueue.on("completed", (job, result)=>{
    console.log("Job has been completed");
});

emailQueue.on("failed", (job, err)=>{
    console.log("Job was occur error", err);
});

export default emailQueue;

