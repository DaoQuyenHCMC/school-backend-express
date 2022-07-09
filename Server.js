//dotenv
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const schoolRoute= require('./routes/SchoolRoute');
const studentRoute= require('./routes/StudentRoute');
const classRoute= require('./routes/ClassRoute');
const contactBookRoute= require('./routes/ContactBookRoute');
const extracurricularActivitiesRoute= require('./routes/ExtracurricularActivitiesRoute');
const familyRoute= require('./routes/FamilyRoute');
const feeRoute= require('./routes/FeeRoute');
const gradeRoute= require('./routes/GradeRoute');
const notificationRoute= require('./routes/NotificationRoute');
const roleRoute= require('./routes/RoleRoute');
const markStudentRoute= require('./routes/MarkStudentRoute');
const subjectRoute= require('./routes/SubjectRoute');
const teacherRoute= require('./routes/TeacherRoute');
const yearRoute= require('./routes/YearRoute');
const auth= require('./routes/AuthRoute');
const statistical= require('./routes/StatisticalRoute');
const cources= require('./routes/CourcesRoute');
const app = express();

//Cors
app.use(cors());

// Body Parser

app.use(express.json());

//Mount the route
app.use('/api', auth);
app.use('/api/school', schoolRoute);
app.use('/api/student', studentRoute);
app.use('/api/class', classRoute);
app.use('/api/contact-book', contactBookRoute);
app.use('/api/extracurricular-activities', extracurricularActivitiesRoute);
app.use('/api/family', familyRoute);
app.use('/api/fee', feeRoute);
app.use('/api/grade', gradeRoute);
app.use('/api/notification', notificationRoute);
app.use('/api/role', roleRoute);
app.use('/api/mark-student', markStudentRoute);
app.use('/api/subject', subjectRoute);
app.use('/api/teacher', teacherRoute);
app.use('/api/year', yearRoute);
app.use('/api/statistical', statistical);
app.use('/api/cource', cources);


const port = process.env.APP_PORT;

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})





