import mongoose from 'mongoose';
import crypto from 'crypto';
import User from './models/User';
import Message from './models/Message';

const run = async () => {
    await mongoose.connect('mongodb://localhost/chat');
    const db = mongoose.connection;

    try {
        await db.dropCollection('messages');
        await db.dropCollection('users');
    } catch (e) {
        console.log('Collections were not present, skipping drop');
    }

    const [user, admin] = await User.create([
        {
            username: 'user',
            password: '123',
            token: crypto.randomUUID(),
            displayName: 'User'
        },
        {
            username: 'admin',
            password: '123',
            token: crypto.randomUUID(),
            displayName: 'Admin'
        },
    ]);

    await Message.create([
        { username: user.username, message: 'Привет, как дела?', timestamp: new Date() },
        { username: admin.username, message: 'Я только что закончил новую песню, тебе стоит послушать!', timestamp: new Date() },
        { username: user.username, message: 'Ты видел этот фильм? Он просто супер!', timestamp: new Date() },
        { username: admin.username, message: 'Как тебе последние новости?', timestamp: new Date() },
        { username: user.username, message: 'Сегодня отличный день для прогулки, не так ли?', timestamp: new Date() },
        { username: admin.username, message: 'Как прошло твоё утро?', timestamp: new Date() },
        { username: user.username, message: 'Ты что-то скрываешь, не хочешь поделиться?', timestamp: new Date() },
        { username: admin.username, message: 'Как ты относишься к новым трендам в музыке?', timestamp: new Date() },
        { username: user.username, message: 'Как тебе последняя песня Кена? Я не могу её перестать слушать.', timestamp: new Date() },
        { username: admin.username, message: 'Я только что попробовал новое кафе, оно просто великолепно!', timestamp: new Date() },
        { username: user.username, message: 'Ты когда-нибудь играл в шахматы? Мне нужно партнёр для игры.', timestamp: new Date() },
        { username: admin.username, message: 'Ты когда-нибудь пробовал йогу? Хочу попробовать что-то новое.', timestamp: new Date() },
        { username: user.username, message: 'Ты предпочитаешь чтение книг или фильмы?', timestamp: new Date() },
        { username: admin.username, message: 'Ты в курсе последних новостей? Было пару интересных событий.', timestamp: new Date() },
        { username: user.username, message: 'Что ты думаешь о последних трендах в моде?', timestamp: new Date() },
        { username: admin.username, message: 'Ты же слышал последний альбом Ланы Дель Рей, он просто потрясающий!', timestamp: new Date() },
        { username: user.username, message: 'Какие книги ты читаешь в последнее время?', timestamp: new Date() },
        { username: admin.username, message: 'Я был на конференции по технологиям вчера, это было очень познавательно!', timestamp: new Date() },
        { username: user.username, message: 'Ты веришь в экстрасенсов? Я тут на днях наткнулся на интересный документальный фильм.', timestamp: new Date() },
        { username: admin.username, message: 'Ты вообще интересуешься психологией? Я начал читать книгу о людях и их поведении.', timestamp: new Date() },
        { username: user.username, message: 'Как ты обычно проводишь выходные? У меня всегда есть куча планов, но я всё равно ничего не успеваю.', timestamp: new Date() },
        { username: admin.username, message: 'Ты играл в последние игры на PS5? Я наконец-то купил её, и теперь весь день в неё играю.', timestamp: new Date() },
        { username: user.username, message: 'Ты когда-нибудь был в путешествии в Индию? Я мечтаю туда съездить.', timestamp: new Date() },
        { username: admin.username, message: 'Какие у тебя планы на ближайший месяц? Мне предстоит много работы, но я всё равно пытаюсь найти время для отдыха.', timestamp: new Date() },
        { username: user.username, message: 'Ты когда-нибудь пробовал кататься на лыжах? Я на днях снова отправляюсь в горы!', timestamp: new Date() },
        { username: admin.username, message: 'Ты знаешь, что у нас скоро будет концерт местной группы? Пошли с нами!', timestamp: new Date() },
        { username: user.username, message: 'Ты когда-нибудь учил французский язык? Я начал и это сложно, но интересно.', timestamp: new Date() },
        { username: admin.username, message: 'Я решил заняться спортом и начать бегать по утрам. Ты как, поддерживаешь форму?', timestamp: new Date() },
        { username: user.username, message: 'Мне нужно научиться готовить, ты умеешь готовить что-то интересное?', timestamp: new Date() },
        { username: admin.username, message: 'Как ты думаешь, когда появится новый альбом? Все ждут его уже давно!', timestamp: new Date() },
        { username: user.username, message: 'Я сегодня сдал экзамен, и это было нелегко, но я справился!', timestamp: new Date() },
        { username: admin.username, message: 'Ты видел последнюю серию этого шоу? Очень захватывающе!', timestamp: new Date() },
    ]);

    console.log('Fixtures added for messages');
    await mongoose.connection.close();
};

run().catch(console.error);
