const express = require('express');
const router = express.Router();

// 摸鱼日历数据
const fishCalendarData = {
    "2024": {
        "holidays": [
            {
                "name": "元旦",
                "date": "2024-01-01",
                "type": "holiday"
            },
            {
                "name": "春节",
                "date": ["2024-02-10", "2024-02-11", "2024-02-12", "2024-02-13", "2024-02-14", "2024-02-15", "2024-02-16", "2024-02-17"],
                "type": "holiday"
            }
        ],
        "workdays": [
            {
                "date": "2024-02-04",
                "type": "workday",
                "description": "春节调休"
            },
            {
                "date": "2024-02-18",
                "type": "workday",
                "description": "春节调休"
            }
        ]
    }
};

// 获取当前摸鱼指数
function getFishIndex(date) {
    const hour = date.getHours();
    const dayOfWeek = date.getDay();
    
    let index = 0;
    
    // 周一到周五的摸鱼指数计算
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        if (hour < 10) index = 20;
        else if (hour < 12) index = 50;
        else if (hour < 15) index = 80;
        else if (hour < 18) index = 60;
        else index = 30;
    }
    
    // 周末摸鱼指数
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        index = 100;
    }
    
    return index;
}

// 获取距离下个节假日的信息
function getNextHoliday(currentDate) {
    const year = currentDate.getFullYear();
    const holidays = fishCalendarData[year]?.holidays || [];
    
    for (const holiday of holidays) {
        const holidayDate = new Date(Array.isArray(holiday.date) ? holiday.date[0] : holiday.date);
        if (holidayDate > currentDate) {
            const diffTime = holidayDate - currentDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return {
                name: holiday.name,
                date: holiday.date,
                daysRemaining: diffDays
            };
        }
    }
    return null;
}

// API 路由
router.get('/current', (req, res) => {
    const now = new Date();
    const fishIndex = getFishIndex(now);
    const nextHoliday = getNextHoliday(now);
    
    res.json({
        date: now.toISOString(),
        fishIndex: fishIndex,
        nextHoliday: nextHoliday,
        tips: getFishTips(fishIndex)
    });
});

// 获取指定日期的摸鱼信息
router.get('/date/:date', (req, res) => {
    const date = new Date(req.params.date);
    const fishIndex = getFishIndex(date);
    const nextHoliday = getNextHoliday(date);
    
    res.json({
        date: date.toISOString(),
        fishIndex: fishIndex,
        nextHoliday: nextHoliday,
        tips: getFishTips(fishIndex)
    });
});

// 获取摸鱼建议
function getFishTips(index) {
    if (index >= 80) return "摸鱼黄金时间，但请注意老板动向";
    if (index >= 50) return "适度摸鱼，保持警惕";
    if (index >= 30) return "摸鱼风险较高，建议专注工作";
    return "摸鱼指数较低，建议好好工作";
}

module.exports = router;
