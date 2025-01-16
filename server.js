const express = require('express');
const fishCalendarRouter = require('./api/fishCalendar');

const app = express();
app.use('/api/fish-calendar', fishCalendarRouter);

app.listen(3000, () => {
    console.log('摸鱼日历 API 服务已启动');
});
