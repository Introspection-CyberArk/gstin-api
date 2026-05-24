export default async function handler(req, res) {
    try {
        const { pan } = req.query;

        if (!pan) {
            return res.status(400).json({
                status: false,
                message: "PAN number required"
            });
        }

        const response = await fetch(
            `https://razorpay.com/api/gstin/pan/${pan}`,
            {
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    "Accept": "application/json"
                }
            }
        );

        const data = await response.json();

        return res.status(200).json({
            status: true,
            result: data
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            error: error.message
        });
    }
}