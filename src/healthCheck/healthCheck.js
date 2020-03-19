const healthCheck = async () => {
        const healthCheck = {
                message: "OK",
                timestamp: Date.now(),
                uptime: process.uptime()
        }
};

export default healthCheck;
