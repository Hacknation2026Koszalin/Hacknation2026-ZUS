// =====================================================================
// SŁOWNIK INTERFEJSU (PL → EN / UK) dla tłumacza strony (tlumaczDOM.js).
// Każdy wiersz: polski tekst | English | Українська  (rozdzielone znakiem „|”).
// Tłumacz podmienia dokładnie pasujące teksty na ekranie, a dla tekstów
// z liczbami i datami używa WZORCÓW niżej. Nowy tekst = nowy wiersz.
// =====================================================================
const WIERSZE = `
Przejdź do treści|Skip to content|Перейти до змісту
Zakład Ubezpieczeń Społecznych|Social Insurance Institution (ZUS)|Управління соціального страхування (ZUS)
Wersja demonstracyjna|Demo version|Демоверсія
Moje konto|My account|Мій кабінет
Moja ścieżka|My path|Мій шлях
Świadczenia|Benefits|Виплати
Złóż wniosek|Apply|Подати заяву
Kalkulator|Calculator|Калькулятор
Moje sprawy|My cases|Мої справи
PUE/eZUS|PUE/eZUS|PUE/eZUS
Pomoc|Help|Допомога
Wyloguj się|Log out|Вийти
Wyloguj|Log out|Вийти
Menu|Menu|Меню
Zamknij|Close|Закрити
Zobacz wszystko|See all|Переглянути все
Ustawienia|Settings|Налаштування
Samouczek|Tutorial|Інструкція
Samouczek — jak działa przewodnik|Tutorial — how the guide works|Інструкція — як працює путівник
Dostępność|Accessibility|Доступність
Powiadomienia|Notifications|Сповіщення
Język serwisu|Site language|Мова сайту
Menu konta|Account menu|Меню кабінету
Menu główne|Main menu|Головне меню
Strona główna|Home page|Головна сторінка
Kliknij, aby przedłużyć sesję|Click to extend the session|Натисніть, щоб продовжити сесію
dni|days|днів
dzień|day|день
do kolejnego kroku|to the next step|до наступного кроку
na złożenie wniosku|to apply|щоб подати заяву
Kolejny krok|Next step|Наступний крок
Kolejny wniosek|Next application|Наступна заява
ostatni dzień:|last day:|останній день:
Planowany termin porodu|Expected due date|Очікувана дата пологів
Data urodzenia dziecka|Child's date of birth|Дата народження дитини
Data przyjęcia dziecka|Date the child joined the family|Дата прийняття дитини
· zmień|· change|· змінити
Zmień|Change|Змінити
Zmień datę|Change date|Змінити дату
Planuję dziecko|I'm planning a child|Я планую дитину
Jestem w ciąży|I'm pregnant|Я вагітна
Spodziewam się dziecka|We're expecting a baby|Ми чекаємо на дитину
Dziecko już się urodziło|My child has been born|Дитина вже народилася
Adopcja lub rodzina zastępcza|Adoption or foster family|Усиновлення або прийомна сім'я
Adoptuję dziecko|I'm adopting a child|Я усиновлюю дитину
Jestem rodziną zastępczą|I'm a foster family|Я прийомна сім'я
Straciliśmy dziecko|We lost our child|Ми втратили дитину
Gratulacje|Congratulations|Вітаємо
Za|In|Через
powitasz swoje maleństwo.|you'll welcome your little one.|ви зустрінете свого малюка.
Przeprowadzimy Cię przez wszystko, co Ci przysługuje.|We'll guide you through everything you're entitled to.|Ми проведемо вас через усе, що вам належить.
Terminów pilnujemy za Ciebie.|We keep track of the deadlines for you.|Ми стежимо за термінами замість вас.
Pokażemy, co warto zrobić, zanim zajdziesz w ciążę.|We'll show you what to do before you get pregnant.|Покажемо, що варто зробити до вагітності.
Zadbamy, żeby żaden termin po porodzie Ci nie umknął.|We'll make sure you don't miss any deadline after the birth.|Подбаємо, щоб ви не пропустили жодного терміну після пологів.
Pokażemy, jakie urlopy i zasiłki Ci przysługują.|We'll show you which leave and benefits you're entitled to.|Покажемо, які відпустки та допомоги вам належать.
Partnerka jest w ciąży. Pokażemy, co przysługuje Tobie jako tacie.|Your partner is pregnant. We'll show you what you're entitled to as a dad.|Партнерка вагітна. Покажемо, що належить вам як татові.
Moja ścieżka|My path|Мій шлях
Co mi przysługuje?|What am I entitled to?|Що мені належить?
Dane z e-ZLA|Data from e-ZLA|Дані з e-ZLA
Status zwolnienia lekarskiego|Sick leave status|Статус лікарняного
Trwa|Ongoing|Триває
Zasiłek wstrzymany|Benefit suspended|Допомогу призупинено
Zwolnienie od|Sick leave from|Лікарняний з
do|to|до
Kod|Code|Код
kod|code|код
ciąża — zasiłek 100% podstawy|pregnancy — benefit 100% of the base|вагітність — допомога 100% бази
do końca|until the end|до кінця
Kto wypłaca|Who pays|Хто виплачує
Wypłata|Payment|Виплата
Co dalej|What's next|Що далі
Urlop macierzyński możesz zacząć od|You can start maternity leave from|Відпустку у зв'язку з материнством можна почати з
— 6 tygodni przed terminem porodu.|— 6 weeks before the due date.|— за 6 тижнів до дати пологів.
Zakończone|Finished|Завершено
Zaplanowane|Planned|Заплановано
Nie masz teraz zwolnienia lekarskiego|You're not on sick leave now|Зараз у вас немає лікарняного
Gdy lekarz wystawi e-ZLA, zobaczysz tu jego status.|When a doctor issues an e-ZLA, you'll see its status here.|Коли лікар видасть e-ZLA, ви побачите тут його статус.
Zwolnienie lekarskie nie da Ci zasiłku|Sick leave won't give you a benefit|Лікарняний не дасть вам допомоги
Pierwsze 33 dni w roku — pracodawca, potem ZUS|First 33 days a year — employer, then ZUS|Перші 33 дні на рік — роботодавець, потім ZUS
ZUS — na konto podane w eZUS|ZUS — to the account given in eZUS|ZUS — на рахунок, вказаний в eZUS
Na teraz|For now|На зараз
Co możesz zrobić|What you can do|Що ви можете зробити
Zobacz, co i kiedy musisz zrobić|See what to do and when|Подивіться, що і коли потрібно зробити
Wszystko odhaczone!|All done!|Усе виконано!
Status Twojej sprawy|Status of your case|Статус вашої справи
Sprawdź, ile dostaniesz|Check how much you'll get|Перевірте, скільки отримаєте
81,5% przez cały rok czy 100% + 70%? Porównaj.|81.5% for the whole year or 100% + 70%? Compare.|81,5% на весь рік чи 100% + 70%? Порівняйте.
Złóż wniosek z przewodnikiem|Apply with the guide|Подайте заяву з путівником
Poprowadzimy Cię pole po polu.|We'll guide you field by field.|Проведемо вас поле за полем.
Kończy się Twoja umowa?|Is your contract ending?|Ваш договір закінчується?
Dodaj datę — sprawdzimy, czy przedłuży się do porodu i co z zasiłkiem.|Add the date — we'll check if it extends until the birth and what happens to the benefit.|Додайте дату — перевіримо, чи продовжиться він до пологів і що з допомогою.
Dodaj datę|Add date|Додати дату
Dodaj termin porodu od lekarza|Add the due date from your doctor|Додайте дату пологів від лікаря
Dodaj termin porodu|Add due date|Додати дату пологів
Dodaj datę urodzenia od lekarza|Add the date of birth|Додайте дату народження
Dodaj datę urodzenia|Add date of birth|Додати дату народження
Policzymy dokładne daty Twoich wniosków. To dobrowolne.|We'll calculate exact dates for your applications. It's optional.|Розрахуємо точні дати ваших заяв. Це добровільно.
Sprawdź dane na koncie PUE/eZUS|Check the data in your PUE/eZUS account|Перевірте дані в кабінеті PUE/eZUS
Składki, zwolnienia i płatnik — a gdy coś się nie zgadza, zapytaj ZUS.|Contributions, sick leave and payer — and if something is wrong, ask ZUS.|Внески, лікарняні та платник — а якщо щось не так, запитайте ZUS.
Konto PUE/eZUS|PUE/eZUS account|Кабінет PUE/eZUS
Asystent ZUSanna podpowie Ci|Assistant ZUSanna will help you|Асистентка ZUSanna підкаже
Zapytaj własnymi słowami o urlopy, zasiłki i wnioski.|Ask in your own words about leave, benefits and applications.|Запитайте своїми словами про відпустки, допомоги та заяви.
Zapytaj ZUSannę|Ask ZUSanna|Запитати ZUSanna
Spłać zaległość, by dostać zasiłek|Pay off the arrears to get the benefit|Погасіть заборгованість, щоб отримати допомогу
Co to oznacza?|What does it mean?|Що це означає?
Co to oznacza? Sprawdź|What does it mean? Check|Що це означає? Перевірте
Zaległość w składkach|Contribution arrears|Заборгованість за внесками
Świadczenie rodzicielskie|Parental benefit|Батьківська допомога
Sprawdź, gdzie i kiedy złożyć wniosek.|Check where and when to apply.|Перевірте, де і коли подати заяву.
Pomoc dla Ciebie|Help for you|Допомога для вас
Kontakty do wsparcia psychologicznego.|Psychological support contacts.|Контакти психологічної підтримки.
Poprzednie karty|Previous cards|Попередні картки
Następne karty|Next cards|Наступні картки
Ukryj powitanie|Hide greeting|Сховати привітання
Otwórz asystentkę ZUSannę|Open assistant ZUSanna|Відкрити асистентку ZUSanna
Mapa strony|Site map|Карта сайту
Deklaracja dostępności|Accessibility statement|Декларація доступності
Polityka prywatności|Privacy policy|Політика конфіденційності
Pliki cookies|Cookies|Файли cookie
Kontakt|Contact|Контакти
Panel administracyjny (demo)|Admin panel (demo)|Панель адміністратора (демо)
(otwiera się w nowej karcie)|(opens in a new tab)|(відкривається в новій вкладці)
— otwiera się w nowej karcie|— opens in a new tab|— відкривається в новій вкладці
Zasiłek macierzyński i inne świadczenia|Maternity benefit and other benefits|Допомога у зв'язку з материнством та інші виплати
Ministerstwo Rodziny, Pracy i Polityki Społecznej|Ministry of Family, Labour and Social Policy|Міністерство сім'ї, праці та соціальної політики
Urlop rodzicielski|Parental leave|Батьківська відпустка
Uprawnienia związane z rodzicielstwem|Parenthood-related rights|Права, пов'язані з батьківством
Państwowa Inspekcja Pracy|National Labour Inspectorate|Державна інспекція праці
Porady prawne — rodzicielstwo|Legal advice — parenthood|Юридичні поради — батьківство
Co i kiedy musisz zrobić|What to do and when|Що і коли потрібно зробити
Każdy krok ma listę rzeczy do odhaczenia. Najważniejsze terminy oznaczyliśmy na czerwono.|Each step has a checklist. The most important deadlines are marked in red.|Кожен крок має список справ. Найважливіші терміни позначені червоним.
zrobione|done|виконано
Liczymy od daty:|Counting from:|Рахуємо від дати:
planowany termin porodu|expected due date|очікувана дата пологів
data urodzenia dziecka|child's date of birth|дата народження дитини
Nie przegap żadnego terminu|Don't miss any deadline|Не пропустіть жодного терміну
Przypomnienia|Reminders|Нагадування
Przed porodem|Before the birth|До пологів
Po porodzie|After the birth|Після пологів
Poród|Birth|Пологи
jutro|tomorrow|завтра
dziś|today|сьогодні
Pilne|Urgent|Терміново
Nie przegap!|Don't miss it!|Не пропустіть!
Warto wiedzieć|Good to know|Варто знати
Wielki dzień|The big day|Великий день
Termin porodu|Due date|Дата пологів
Od tego dnia liczą się wszystkie kolejne terminy.|All further deadlines are counted from this day.|Від цього дня рахуються всі наступні терміни.
jeśli poród będzie w terminie|if the birth is on time|якщо пологи будуть вчасно
Poproś lekarza o zaświadczenie|Ask your doctor for a certificate|Попросіть лікаря про довідку
Zaświadczenie o przewidywanej dacie porodu przyda się do wniosku złożonego przed porodem.|A certificate of the expected due date is needed for an application before the birth.|Довідка про очікувану дату пологів знадобиться для заяви до пологів.
Weź od lekarza lub położnej zaświadczenie o przewidywanej dacie porodu|Get a certificate of the expected due date from your doctor or midwife|Візьміть у лікаря або акушерки довідку про очікувану дату пологів
Możesz zacząć urlop macierzyński|You can start maternity leave|Можна почати відпустку у зв'язку з материнством
Mama może zacząć urlop i zasiłek do 6 tygodni przed przewidywanym porodem.|Mum can start leave and the benefit up to 6 weeks before the expected birth.|Мама може почати відпустку і допомогу за 6 тижнів до очікуваних пологів.
Zdecyduj: 81,5% przez cały rok czy 100% + 70%|Decide: 81.5% for the whole year or 100% + 70%|Вирішіть: 81,5% на весь рік чи 100% + 70%
Porównaj w kalkulatorze|Compare in the calculator|Порівняйте в калькуляторі
Złóż wniosek o zasiłek macierzyński|Apply for the maternity benefit|Подайте заяву на допомогу у зв'язку з материнством
Powiedz pracodawcy, od kiedy idziesz na urlop|Tell your employer when your leave starts|Повідомте роботодавця, з якого дня йдете у відпустку
21 dni po porodzie — dwa obowiązki|21 days after the birth — two duties|21 день після пологів — два обов'язки
Najważniejszy termin. Po nim tracisz wariant 81,5%.|The key deadline. After it you lose the 81.5% option.|Найважливіший термін. Після нього ви втрачаєте варіант 81,5%.
Zgłoś urodzenie w urzędzie stanu cywilnego (albo przez internet)|Register the birth at the civil registry office (or online)|Зареєструйте народження в РАЦС (або онлайн)
Dziecko dostanie wtedy PESEL.|The child will then get a PESEL number.|Тоді дитина отримає номер PESEL.
Jeśli wybierasz 81,5% — wniosek musi być już złożony|If you choose 81.5%, the application must already be submitted|Якщо обираєте 81,5% — заява вже має бути подана
Sprawdź wniosek|Check the application|Перевірити заяву
800+ z wyrównaniem od urodzenia|800+ backdated to the birth|800+ з виплатою від народження
Wniosek złożony w tym czasie daje pieniądze od miesiąca narodzin dziecka.|An application filed in this period gives money from the month of birth.|Заява, подана в цей час, дає гроші від місяця народження дитини.
Złóż wniosek o 800+ (eZUS, bank albo mObywatel)|Apply for 800+ (eZUS, bank or mObywatel)|Подайте заяву на 800+ (eZUS, банк або mObywatel)
Koniec urlopu macierzyńskiego|End of maternity leave|Кінець відпустки у зв'язку з материнством
Potem urlop rodzicielski — przy wariancie 81,5% jest już zaplanowany.|Then parental leave — with the 81.5% option it's already planned.|Потім батьківська відпустка — у варіанті 81,5% вона вже запланована.
Ustalcie, kto i kiedy weźmie urlop rodzicielski (9 tygodni jest tylko dla drugiego rodzica)|Agree who takes parental leave and when (9 weeks are only for the other parent)|Домовтеся, хто і коли візьме батьківську відпустку (9 тижнів — лише для другого з батьків)
Przy wariancie 100% — wniosek o urlop rodzicielski 21 dni przed jego początkiem|With the 100% option — apply for parental leave 21 days before it starts|У варіанті 100% — заява на батьківську відпустку за 21 день до її початку
Ostatni dzień na urlop ojcowski|Last day for paternity leave|Останній день батьківської (для тата) відпустки
Tata ma 2 tygodnie do wykorzystania do 1. urodzin dziecka.|Dad has 2 weeks to use before the child's 1st birthday.|Тато має 2 тижні, які треба використати до 1-го дня народження дитини.
Tata: wniosek o urlop ojcowski do pracodawcy|Dad: paternity leave application to the employer|Тато: заява на відпустку для тата до роботодавця
Postęp listy zadań|Checklist progress|Прогрес списку справ
Co Ci przysługuje|What you're entitled to|Що вам належить
Każde świadczenie opisujemy prostym językiem i od razu mówimy, czy Ci przysługuje.|We describe each benefit in plain language and tell you right away if you're entitled to it.|Кожну виплату описуємо простою мовою і одразу кажемо, чи вона вам належить.
Twoje składki w ZUS|Your ZUS contributions|Ваші внески в ZUS
Dziś nie masz zaległości w składkach.|You have no contribution arrears today.|Сьогодні у вас немає заборгованості за внесками.
Stan na dzień powstania prawa do zasiłku|Status on the day the right to the benefit arises|Стан на день виникнення права на допомогу
zasiłek chorobowy — początek obecnego zwolnienia|sickness benefit — start of the current sick leave|допомога з хвороби — початок поточного лікарняного
zasiłek macierzyński — planowany dzień porodu|maternity benefit — expected day of birth|допомога у зв'язку з материнством — очікуваний день пологів
Wystaw zaświadczenie (symulacja)|Issue a certificate (simulation)|Видати довідку (симуляція)
Na co uważać|What to watch out for|На що звернути увагу
— kiedy możesz stracić świadczenie albo dostać mniej|— when you could lose a benefit or get less|— коли можна втратити виплату або отримати менше
Zasiłek macierzyński|Maternity benefit|Допомога у зв'язку з материнством
Pieniądze za czas urlopu macierzyńskiego, rodzicielskiego i ojcowskiego.|Money for maternity, parental and paternity leave.|Гроші за час відпустки у зв'язку з материнством, батьківської та відпустки для тата.
Przysługuje Ci|You're entitled|Вам належить
Przeczytaj przewodnik|Read the guide|Читати путівник
Zasiłek chorobowy w ciąży|Sickness benefit in pregnancy|Допомога з хвороби під час вагітності
Świadczenie rehabilitacyjne|Rehabilitation benefit|Реабілітаційна допомога
Gdy wyczerpiesz zasiłek chorobowy|When your sickness benefit runs out|Коли закінчиться допомога з хвороби
Zasiłek w wysokości zasiłku macierzyńskiego|Benefit equal to the maternity benefit|Допомога в розмірі допомоги у зв'язку з материнством
Gdy stracisz pracę przez upadłość lub likwidację|If you lose your job due to bankruptcy or liquidation|Якщо втратите роботу через банкрутство або ліквідацію
Urlop ojcowski|Paternity leave|Відпустка для тата
2 tygodnie dla taty do 1. urodzin dziecka. Zasiłek: 100% podstawy.|2 weeks for dad before the child's 1st birthday. Benefit: 100% of the base.|2 тижні для тата до 1-го дня народження дитини. Допомога: 100% бази.
Dla taty|For dad|Для тата
Dla osób bez ubezpieczenia chorobowego. Wniosek składasz w urzędzie gminy lub miasta, nie w ZUS.|For people without sickness insurance. You apply at the municipal office, not at ZUS.|Для осіб без страхування на випадок хвороби. Заяву подаєте в гміні або міській раді, не в ZUS.
Nie dotyczy — masz zasiłek|Not applicable — you have the benefit|Не стосується — у вас є допомога
Na każde dziecko do 18. roku życia. Wniosek do 3 miesięcy od urodzenia daje wyrównanie od miesiąca narodzin.|For every child under 18. Applying within 3 months of birth backdates it to the month of birth.|На кожну дитину до 18 років. Заява протягом 3 місяців від народження дає виплату від місяця народження.
Zasiłek opiekuńczy|Care allowance|Допомога по догляду
Gdy opiekujesz się chorym dzieckiem. Do 60 dni w roku na dziecko do 14 lat.|When you care for a sick child. Up to 60 days a year for a child under 14.|Коли доглядаєте хвору дитину. До 60 днів на рік на дитину до 14 років.
Na później|For later|На потім
Wnioski i oświadczenia|Applications and statements|Заяви та декларації
Wybierz formularz — poprowadzimy Cię pole po polu. Dane z mObywatela i ZUS wpiszemy za Ciebie.|Choose a form — we'll guide you field by field. We'll fill in data from mObywatel and ZUS for you.|Оберіть форму — проведемо вас поле за полем. Дані з mObywatel і ZUS заповнимо за вас.
Szukaj wniosku|Search applications|Пошук заяви
Szukaj, np. „zmiana konta”, „ZAS-23”, „podatek”|Search, e.g. "account change", "ZAS-23", "tax"|Пошук, напр. «зміна рахунку», «ZAS-23», «податок»
Polecane dla Ciebie|Recommended for you|Рекомендовано для вас
Wniosek o urlop macierzyński|Maternity leave application|Заява на відпустку у зв'язку з материнством
Wniosek o urlop rodzicielski|Parental leave application|Заява на батьківську відпустку
Wniosek o zasiłek macierzyński|Maternity benefit application|Заява на допомогу у зв'язку з материнством
Wniosek o świadczenie wychowawcze 800+|Child benefit 800+ application|Заява на виховну допомогу 800+
Wniosek o odpis aktu urodzenia dziecka|Application for a copy of the birth certificate|Заява на копію свідоцтва про народження
Wniosek o urlop ojcowski|Paternity leave application|Заява на відпустку для тата
Wniosek o urlop wychowawczy|Childcare leave application|Заява на відпустку по догляду за дитиною
Oświadczenie o przyjęciu dziecka na wychowanie|Statement on taking a child into care|Декларація про прийняття дитини на виховання
Wniosek o skrócenie lub wstrzymanie zasiłku macierzyńskiego|Application to shorten or suspend the maternity benefit|Заява на скорочення або призупинення допомоги у зв'язку з материнством
Wniosek o wydanie zaświadczenia w sprawie zasiłku|Application for a benefit certificate|Заява на видачу довідки щодо допомоги
Wniosek o zmianę danych osoby pobierającej zasiłek|Change of details of the benefit recipient|Заява на зміну даних одержувача допомоги
Wniosek o wyjaśnienia, decyzję albo skarga w sprawie zasiłku|Request for explanation, decision or complaint about a benefit|Запит на роз'яснення, рішення або скарга щодо допомоги
Wniosek o wypłatę zasiłku należnego osobie zmarłej|Payment of a benefit due to a deceased person|Заява на виплату допомоги, належної померлій особі
ok.|approx.|бл.
Składasz|You submit|Подаєте
u pracodawcy|to the employer|роботодавцю
w ZUS|at ZUS|в ZUS
w USC (gov.pl)|at the civil registry (gov.pl)|в РАЦС (gov.pl)
Najważniejszy wniosek na Twoim etapie|The most important application at your stage|Найважливіша заява на вашому етапі
Świadczenia na dziecko|Child benefits|Виплати на дитину
Akt urodzenia — urząd stanu cywilnego|Birth certificate — civil registry office|Свідоцтво про народження — РАЦС
Urlopy — składasz u pracodawcy|Leave — submitted to the employer|Відпустки — подаєте роботодавцю
Opieka nad dzieckiem|Childcare|Догляд за дитиною
Podatek od zasiłku|Tax on the benefit|Податок з допомоги
Zmiany, zaświadczenia i sprawy|Changes, certificates and cases|Зміни, довідки та справи
Dokumenty, które wypełnia ktoś inny|Documents filled in by someone else|Документи, які заповнює хтось інший
Wypełnia:|Filled in by:|Заповнює:
Pracodawca|Employer|Роботодавець
Jak o nie poprosić?|How to request it?|Як про нього попросити?
Skopiuj gotową prośbę (e-mail)|Copy a ready request (e-mail)|Скопіювати готовий запит (e-mail)
Może Cię dotyczyć|May apply to you|Може вас стосуватися
Kalkulator zasiłku macierzyńskiego|Maternity benefit calculator|Калькулятор допомоги у зв'язку з материнством
Ustaw kilka rzeczy krok po kroku. Wynik zobaczysz na dole — zmienia się od razu.|Set a few things step by step. The result is at the bottom and updates instantly.|Налаштуйте кілька речей крок за кроком. Результат унизу — змінюється одразу.
Albo wczytaj przykład:|Or load an example:|Або завантажте приклад:
— wybierz przykład —|— choose an example —|— оберіть приклад —
Dziecko|Child|Дитина
Urodzenie czy przyjęcie na wychowanie i ile dzieci.|Birth or taking into care, and how many children.|Народження чи прийняття на виховання і скільки дітей.
Urodzenie dziecka|Birth of a child|Народження дитини
Przyjęcie na wychowanie|Taking into care|Прийняття на виховання
Liczba dzieci|Number of children|Кількість дітей
Data porodu (do terminów)|Date of birth (for deadlines)|Дата пологів (для термінів)
Wiek dziecka (lata)|Child's age (years)|Вік дитини (роки)
Mam zaświadczenie „Za życiem” (dłuższy urlop rodzicielski)|I have the "Za życiem" certificate (longer parental leave)|Маю довідку «Za życiem» (довша батьківська відпустка)
Kto bierze urlop|Who takes leave|Хто бере відпустку
Jeden rodzic czy oboje — urlop można podzielić.|One parent or both — leave can be shared.|Один із батьків чи обоє — відпустку можна поділити.
Tylko matka|Mother only|Лише мати
Oboje rodzice|Both parents|Обоє батьків
Złożę wniosek o 81,5% przez cały rok (w ciągu 21 dni po porodzie)|I'll apply for 81.5% for the whole year (within 21 days of birth)|Подам заяву на 81,5% на весь рік (протягом 21 дня після пологів)
Ile zarabiasz|How much you earn|Скільки ви заробляєте
Wpisaliśmy podstawę z danych ZUS — możesz ją zmienić.|We entered the base from ZUS data — you can change it.|Ми вписали базу з даних ZUS — її можна змінити.
Podstawa wymiaru|Benefit base|База розрахунку
Wynagrodzenie brutto|Gross salary|Зарплата брутто
Matka — podstawa|Mother — base|Мати — база
Ojciec — podstawa|Father — base|Батько — база
Podział urlopu|Sharing the leave|Поділ відпустки
Praca i dodatkowy urlop|Work and extra leave|Робота і додаткова відпустка
(opcjonalnie)|(optional)|(необов'язково)
Pomiń, jeśli nie planujesz pracy w czasie urlopu.|Skip if you don't plan to work during leave.|Пропустіть, якщо не плануєте працювати під час відпустки.
Matka: praca w czasie urlopu rodzicielskiego|Mother: work during parental leave|Мати: робота під час батьківської відпустки
Uzupełniający urlop macierzyński (wcześniak / szpital), tygodnie|Supplementary maternity leave (premature baby / hospital), weeks|Додаткова відпустка у зв'язку з материнством (недоношена дитина / лікарня), тижні
Twój wynik|Your result|Ваш результат
Łącznie dostaniesz około|In total you'll get about|Загалом ви отримаєте приблизно
Urlop|Leave|Відпустка
Jak długo|How long|Як довго
Stawka|Rate|Ставка
Miesięcznie|Monthly|Щомісяця
Razem|Total|Разом
Urlop macierzyński|Maternity leave|Відпустка у зв'язку з материнством
Matka|Mother|Мати
Ojciec|Father|Батько
Terminy|Deadlines|Терміни
To symulacja orientacyjna. Zasiłek za pełny miesiąc liczony jest z 30 dni; ostateczną kwotę ustala ZUS lub płatnik składek.|This is an approximate simulation. A full month's benefit is calculated from 30 days; the final amount is set by ZUS or the contribution payer.|Це орієнтовна симуляція. Допомога за повний місяць рахується з 30 днів; остаточну суму визначає ZUS або платник внесків.
Łącznie ok.|Total approx.|Разом бл.
Zobacz wynik ↓|See result ↓|Дивитися результат ↓
Ustawienia kalkulatora|Calculator settings|Налаштування калькулятора
Mniej|Less|Менше
Więcej|More|Більше
Wszystkie Twoje wnioski w jednym miejscu. Filtruj po statusie, kategorii albo dacie.|All your applications in one place. Filter by status, category or date.|Усі ваші заяви в одному місці. Фільтруйте за статусом, категорією або датою.
Wszystkie|All|Усі
W trakcie|In progress|У процесі
Do poprawy|To correct|На виправлення
Przyjęte|Accepted|Прийняті
Szukaj|Search|Пошук
Kategoria|Category|Категорія
Wszystkie kategorie|All categories|Усі категорії
Zasiłki z ZUS|ZUS benefits|Допомоги ZUS
Urlopy u pracodawcy|Leave with the employer|Відпустки в роботодавця
800+ i świadczenia rodzinne|800+ and family benefits|800+ та сімейні виплати
Urząd stanu cywilnego|Civil registry office|РАЦС
Składki i zaświadczenia|Contributions and certificates|Внески та довідки
Gdzie złożono|Where submitted|Куди подано
Wszędzie|Everywhere|Скрізь
Data złożenia|Submission date|Дата подання
Cały czas|All time|За весь час
Ostatnie 30 dni|Last 30 days|Останні 30 днів
Ostatnie 3 miesiące|Last 3 months|Останні 3 місяці
Ten rok|This year|Цей рік
Kolejność|Order|Порядок
Najnowsze najpierw|Newest first|Спочатку нові
Najstarsze najpierw|Oldest first|Спочатку старі
Lista|List|Список
Według kategorii|By category|За категоріями
Nr|No.|№
z konta|from account|з кабінету
Do uzupełnienia|To complete|На доповнення
Urzędnik prosi o uzupełnienie|The officer asks for more information|Службовець просить доповнити
Popraw wniosek|Correct the application|Виправити заяву
Ukryj historię sprawy|Hide case history|Сховати історію справи
Pokaż historię sprawy|Show case history|Показати історію справи
Wniosek wysłany|Application sent|Заяву надіслано
Wniosek wysłany przez eZUS|Application sent via eZUS|Заяву надіслано через eZUS
Zakończona|Closed|Завершена
U pracodawcy|With the employer|У роботодавця
W ZUS — u urzędnika|At ZUS — with an officer|У ZUS — у службовця
Przyjęty do realizacji|Accepted for processing|Прийнято до розгляду
Sprawdza urzędnik|An officer is checking|Перевіряє службовець
Sprawdza pracodawca|The employer is checking|Перевіряє роботодавець
Damy znać, jeśli czegoś zabraknie|We'll let you know if anything is missing|Повідомимо, якщо чогось бракуватиме
Wyczyść filtry|Clear filters|Очистити фільтри
Żadna sprawa nie pasuje do filtrów.|No case matches the filters.|Жодна справа не відповідає фільтрам.
Nie masz jeszcze żadnych spraw.|You don't have any cases yet.|У вас ще немає справ.
Status spraw|Case status|Статус справ
Nazwa albo numer sprawy|Name or case number|Назва або номер справи
Układ listy|List layout|Вигляд списку
Historia sprawy|Case history|Історія справи
Zmiana numeru konta do wypłaty zasiłku (ZZD)|Change of bank account for benefit payment (ZZD)|Зміна рахунку для виплати допомоги (ZZD)
Zaświadczenie o niezaleganiu w składkach|Certificate of no contribution arrears|Довідка про відсутність заборгованості
Zasiłek chorobowy w ciąży (e-ZLA, kod B)|Sickness benefit in pregnancy (e-ZLA, code B)|Допомога з хвороби під час вагітності (e-ZLA, код B)
Zaświadczenie wydane — do pobrania w eZUS.|Certificate issued — download it in eZUS.|Довідку видано — завантажте в eZUS.
Tryb demo:|Demo mode:|Демо-режим:
albo|or|або
widok urzędnika ZUS|ZUS officer view|вигляд службовця ZUS
widok pracodawcy (kadry)|employer view (HR)|вигляд роботодавця (кадри)
Gdzie szukać pomocy|Where to find help|Де шукати допомогу
Masz pytanie albo potrzebujesz porozmawiać? Wybierz najwygodniejszy sposób.|Have a question or need to talk? Choose the most convenient way.|Маєте питання або потрібно поговорити? Оберіть найзручніший спосіб.
Kontakt z ZUS|Contact ZUS|Зв'язок із ZUS
Skrzynka mama@zus.pl|mama@zus.pl mailbox|Скринька mama@zus.pl
Otwórz|Open|Відкрити
Otwórz czat|Open chat|Відкрити чат
Uruchom|Start|Запустити
Wsparcie psychologiczne|Psychological support|Психологічна підтримка
Organizacje, które pomagają w trudnych chwilach|Organisations that help in difficult times|Організації, які допомагають у важкі хвилини
Fundacje i hospicja perinatalne|Foundations and perinatal hospices|Фонди та перинатальні хоспіси
Wcześniak|Premature baby|Недоношена дитина
Ciężko chore dziecko|Seriously ill child|Тяжкохвора дитина
Poronienie i strata dziecka|Miscarriage and loss of a child|Викидень і втрата дитини
Lista hospicjów perinatalnych w Polsce|List of perinatal hospices in Poland|Список перинатальних хоспісів у Польщі
Sytuacje, w których możesz stracić świadczenie albo dostać mniej — i terminy, których nie warto przegapić.|Situations in which you could lose a benefit or get less — and deadlines not to miss.|Ситуації, коли можна втратити виплату або отримати менше, — і терміни, які не варто пропускати.
Dotyczy Ciebie:|Applies to you:|Стосується вас:
Jesteś teraz na zwolnieniu lekarskim.|You're on sick leave now.|Зараз ви на лікарняному.
Praca w czasie zwolnienia lekarskiego|Working during sick leave|Робота під час лікарняного
Koniec umowy o pracę w ciąży|Employment contract ending during pregnancy|Закінчення трудового договору під час вагітності
Jesteś w ciąży i masz umowę o pracę.|You're pregnant and have an employment contract.|Ви вагітні й маєте трудовий договір.
Dodaj datę końca umowy|Add contract end date|Додати дату закінчення договору
Praca w czasie urlopu|Working during leave|Робота під час відпустки
Będziesz na urlopie z zasiłkiem.|You'll be on leave with a benefit.|Ви будете у відпустці з допомогою.
Wybór 81,5% albo 100% + 70%|Choosing 81.5% or 100% + 70%|Вибір 81,5% або 100% + 70%
Ten wybór czeka Cię przy wniosku ZAM.|You'll make this choice in the ZAM application.|Цей вибір чекає на вас у заяві ZAM.
9 tygodni urlopu rodzicielskiego dla drugiego rodzica|9 weeks of parental leave for the other parent|9 тижнів батьківської відпустки для другого з батьків
Ustalcie, kto i kiedy bierze urlop.|Agree who takes leave and when.|Домовтеся, хто і коли бере відпустку.
3 miesiące na 800+ i świadczenie rodzicielskie|3 months for 800+ and the parental benefit|3 місяці на 800+ і батьківську допомогу
Zaplanuj wnioski zaraz po porodzie.|Plan your applications right after the birth.|Сплануйте заяви одразу після пологів.
Wniosek o świadczenie rehabilitacyjne przed końcem zasiłku|Apply for the rehabilitation benefit before the benefit ends|Заява на реабілітаційну допомогу до закінчення допомоги
Kiedy możesz stracić prawo do świadczenia|When you could lose the right to a benefit|Коли можна втратити право на виплату
Sprawdź stan składek|Check your contributions|Перевірити стан внесків
Spóźniona dobrowolna składka chorobowa|Late voluntary sickness contribution|Прострочений добровільний внесок на випадок хвороби
Niezgłoszone zmiany|Unreported changes|Неповідомлені зміни
Zgłoś zmianę danych (ZZD)|Report a change of details (ZZD)|Повідомити про зміну даних (ZZD)
Co zmienia wysokość lub długość świadczenia|What changes the amount or length of a benefit|Що змінює розмір або тривалість виплати
Niska lub świeżo zmieniona podstawa|Low or recently changed base|Низька або нещодавно змінена база
Łączenie urlopu rodzicielskiego z pracą|Combining parental leave with work|Поєднання батьківської відпустки з роботою
Terminy, które przepadają|Deadlines that expire|Терміни, що спливають
Urlop ojcowski do 1. urodzin|Paternity leave before the 1st birthday|Відпустка для тата до 1-го дня народження
Połącz Przewodnik ze swoim kontem w PUE/eZUS. Zobaczysz dane, które ZUS ma na Twoim koncie, i zadasz pytanie, gdy coś budzi wątpliwości.|Connect the Guide to your PUE/eZUS account. You'll see the data ZUS holds and can ask a question if something is unclear.|Підключіть Путівник до свого кабінету PUE/eZUS. Ви побачите дані, які має ZUS, і зможете поставити питання, якщо щось викликає сумнів.
dane osobowe i adres|personal data and address|особисті дані та адреса
ubezpieczenia i płatnik składek|insurance and contribution payer|страхування та платник внесків
składki z ostatnich miesięcy|contributions from recent months|внески за останні місяці
zwolnienia lekarskie (e-ZLA)|sick leave (e-ZLA)|лікарняні (e-ZLA)
Połącz z PUE/eZUS|Connect to PUE/eZUS|Підключитися до PUE/eZUS
Symulacja: nie podajesz loginu ani hasła. Dane są przykładowe.|Simulation: you don't enter a login or password. The data is sample data.|Симуляція: ви не вводите логін чи пароль. Дані приклад.
Łączę z PUE/eZUS przez login.gov.pl|Connecting to PUE/eZUS via login.gov.pl|Підключаюся до PUE/eZUS через login.gov.pl
Potwierdzam Twoją tożsamość (mObywatel)|Confirming your identity (mObywatel)|Підтверджую вашу особу (mObywatel)
Pobieram dane z konta ubezpieczonego|Downloading data from the insured person's account|Завантажую дані з кабінету застрахованої особи
Sprawdzam składki i zwolnienia lekarskie|Checking contributions and sick leave|Перевіряю внески та лікарняні
Odśwież dane|Refresh data|Оновити дані
Zapytaj ZUS|Ask ZUS|Запитати ZUS
Ubezpieczenie chorobowe|Sickness insurance|Страхування на випадок хвороби
Podstawa zasiłku|Benefit base|База допомоги
Zaległości w składkach|Contribution arrears|Заборгованість за внесками
Zwolnienia w tym roku|Sick leave this year|Лікарняні цього року
brak|none|немає
Dane osobowe|Personal data|Особисті дані
Ubezpieczenia|Insurance|Страхування
Składki|Contributions|Внески
Zwolnienia e-ZLA|e-ZLA sick leave|Лікарняні e-ZLA
Imię i nazwisko|Full name|Ім'я та прізвище
Data urodzenia|Date of birth|Дата народження
Adres zamieszkania|Home address|Адреса проживання
Rachunek do wypłat|Payment account|Рахунок для виплат
Tytuł ubezpieczenia|Insurance basis|Підстава страхування
Ubezpieczenie od|Insured since|Застраховано з
Płatnik składek|Contribution payer|Платник внесків
Okres wyczekiwania|Waiting period|Період очікування
Kto wypłaca zasiłki|Who pays benefits|Хто виплачує допомоги
spełniony|met|виконано
Nie zgadza się?|Not correct?|Не збігається?
Zapytaj|Ask|Запитати
Miesiąc|Month|Місяць
Podstawa|Base|База
Składka chorobowa|Sickness contribution|Внесок на випадок хвороби
Status|Status|Статус
✓ opłacona|✓ paid|✓ сплачено
! nieopłacona|! unpaid|! не сплачено
zakończone|finished|завершено
trwa|ongoing|триває
Napisz do ZUS|Write to ZUS|Написати до ZUS
Temat|Subject|Тема
Twoje pytanie|Your question|Ваше питання
Jak chcesz dostać odpowiedź?|How do you want to get the answer?|Як ви хочете отримати відповідь?
Wiadomość w PUE/eZUS|Message in PUE/eZUS|Повідомлення в PUE/eZUS
E-mail|E-mail|E-mail
Telefon od konsultanta|Phone call from a consultant|Дзвінок від консультанта
Wyślij pytanie|Send question|Надіслати питання
Twoje wiadomości|Your messages|Ваші повідомлення
Konsultant ZUS|ZUS consultant|Консультант ZUS
✓ odpowiedziano|✓ answered|✓ відповідь надано
● czeka na odpowiedź|● awaiting reply|● очікує відповіді
Zasiłek chorobowy / zwolnienie|Sickness benefit / sick leave|Допомога з хвороби / лікарняний
Składki i zaległości|Contributions and arrears|Внески та заборгованість
Dane na koncie (błąd)|Account data (error)|Дані в кабінеті (помилка)
800+ i świadczenia rodzinne|800+ and family benefits|800+ та сімейні виплати
Inne|Other|Інше
Kim jesteś dla dziecka?|Who are you to the child?|Ким ви є для дитини?
Od tego zależy, jakie urlopy, zasiłki i inne świadczenia Ci przysługują.|This determines which leave, benefits and other support you're entitled to.|Від цього залежить, які відпустки, допомоги та інші виплати вам належать.
Mamą|Mother|Мамою
Tatą|Father|Татом
Opiekunem|Guardian|Опікуном
adopcja albo rodzina zastępcza|adoption or foster family|усиновлення або прийомна сім'я
Na jakim jesteś etapie?|What stage are you at?|На якому ви етапі?
Dopasujemy przewodnik do Twojej sytuacji. Wybór możesz później zmienić.|We'll tailor the guide to your situation. You can change it later.|Ми налаштуємо путівник під вашу ситуацію. Вибір можна змінити пізніше.
Jak teraz pracujesz?|How do you work now?|Як ви зараз працюєте?
Umowa o pracę|Employment contract|Трудовий договір
Własna działalność gospodarcza|Own business|Власна підприємницька діяльність
Umowa zlecenie|Contract of mandate|Договір доручення
Nie pracuję|I don't work|Не працюю
Inaczej|Other|Інакше
Czy opłacasz dobrowolne ubezpieczenie chorobowe?|Do you pay voluntary sickness insurance?|Чи сплачуєте ви добровільне страхування на випадок хвороби?
Tak|Yes|Так
Nie|No|Ні
Nie wiem|I don't know|Не знаю
Dalej|Next|Далі
Wstecz|Back|Назад
Krok|Step|Крок
Twoje odpowiedzi|Your answers|Ваші відповіді
Kim jesteś dla dziecka|Who you are to the child|Ким ви є для дитини
Etap|Stage|Етап
Praca|Work|Робота
Zmień odpowiedzi|Change answers|Змінити відповіді
Koniec umowy o pracę (opcjonalnie)|End of employment contract (optional)|Закінчення трудового договору (необов'язково)
Data ustania stosunku pracy|Employment end date|Дата припинення трудових відносин
Powód|Reason|Причина
— wybierz —|— choose —|— оберіть —
Przypominaj o terminach|Remind me about deadlines|Нагадувати про терміни
Ułatwienia dostępu|Accessibility options|Спеціальні можливості
Wielkość tekstu|Text size|Розмір тексту
Kontrast|Contrast|Контраст
Standardowy|Standard|Стандартний
Wysoki|High|Високий
Żółty na czarnym|Yellow on black|Жовтий на чорному
Czarny na żółtym|Black on yellow|Чорний на жовтому
Kolory dla daltonistów|Colours for colour blindness|Кольори для дальтоніків
Wyłączone|Off|Вимкнено
Czerwony i zielony|Red and green|Червоний і зелений
Niebieski i żółty|Blue and yellow|Синій і жовтий
Statusy pokazujemy też ikoną i słowem — nie tylko kolorem.|Statuses are also shown with an icon and a word — not only colour.|Статуси показуємо також іконкою і словом — не лише кольором.
Czytanie na głos|Read aloud|Читання вголос
Przeczytaj stronę|Read the page|Прочитати сторінку
Zatrzymaj|Stop|Зупинити
Czytaj po kliknięciu|Read on click|Читати після натискання
Czyta tekst, który klikniesz albo zaznaczysz Tabem|Reads the text you click or reach with Tab|Читає текст, який ви натиснете або виберете клавішею Tab
Czytelna czcionka|Readable font|Читабельний шрифт
Prostsze litery, np. przy dysleksji|Simpler letters, e.g. for dyslexia|Простіші літери, напр. при дислексії
Większe odstępy|Larger spacing|Більші інтервали
Łatwiej czytać dłuższe teksty|Easier to read longer texts|Легше читати довші тексти
Linijka do czytania|Reading ruler|Лінійка для читання
Pasek, który idzie za myszką|A bar that follows the mouse|Смуга, що рухається за мишею
Podkreśl linki|Underline links|Підкреслити посилання
Linki widać bez koloru|Links visible without colour|Посилання видно без кольору
Wyraźny fokus|Clear focus|Чіткий фокус
Gruba ramka przy obsłudze klawiaturą|Thick frame when using the keyboard|Товста рамка під час роботи з клавіатурою
Duży kursor|Large cursor|Великий курсор
Łatwiej znaleźć wskaźnik myszy|Easier to find the mouse pointer|Легше знайти вказівник миші
Ukryj obrazki|Hide images|Сховати зображення
Mniej rozpraszaczy na stronie|Fewer distractions on the page|Менше відволікань на сторінці
Zatrzymaj animacje|Stop animations|Зупинити анімації
Bez ruchu i migania|No motion or flashing|Без руху і миготіння
Przywróć domyślne|Restore defaults|Відновити типові
tłumacz polskiego języka migowego (PJM)|Polish Sign Language (PJM) interpreter|перекладач польської жестової мови (PJM)
Tryb demonstracyjny|Demo mode|Демонстраційний режим
Wariant: zaległość w składkach|Variant: contribution arrears|Варіант: заборгованість за внесками
Dane w tej przeglądarce|Data in this browser|Дані в цьому браузері
Odhaczone zadania i szkic wniosku zapisujemy tylko na tym urządzeniu.|Ticked tasks and application drafts are saved only on this device.|Виконані завдання та чернетку заяви зберігаємо лише на цьому пристрої.
Wyczyść moje dane|Clear my data|Очистити мої дані
Gotowe|Done|Готово
Zamknij ustawienia|Close settings|Закрити налаштування
Standardowy tekst|Standard text|Стандартний текст
Większy tekst|Larger text|Більший текст
Największy tekst|Largest text|Найбільший текст
Masz zaległość w składkach ZUS|You have ZUS contribution arrears|У вас є заборгованість за внесками ZUS
Jak spłacić|How to pay|Як сплатити
Rozumiem|I understand|Зрозуміло
zaświadczenie|certificate|довідка
Co mam zrobić?|What should I do?|Що мені робити?
ZUS bliżej Ciebie|ZUS closer to you|ZUS ближче до вас
Co się zmienia|What is changing|Що змінюється
w Twoim|in your|у вашому
życiu?|life?|житті?
Wybierz, co Cię dotyczy|Choose what applies to you|Оберіть, що вас стосується
Zostaję rodzicem|I'm becoming a parent|Я стаю батьком/матір'ю
Urlopy i zasiłki|Leave and benefits|Відпустки та допомоги
Prowadzę firmę|I run a business|Я веду бізнес
Składki i rozliczenia|Contributions and settlements|Внески та розрахунки
Choruję lub opiekuję się bliskim|I'm ill or caring for someone|Я хворію або доглядаю близьку людину
Zwolnienia i zasiłki|Sick leave and benefits|Лікарняні та допомоги
Myślę o emeryturze|I'm thinking about retirement|Я думаю про пенсію
Wiek, wysokość, wniosek|Age, amount, application|Вік, розмір, заява
Zaloguj się do eZUS|Log in to eZUS|Увійти до eZUS
Zaloguj do eZUS|Log in to eZUS|Увійти до eZUS
Zaloguj do PUE/eZUS|Log in to PUE/eZUS|Увійти до PUE/eZUS
Zaloguj do Przewodnika Młodego Rodzica|Log in to the Young Parent Guide|Увійти до Путівника молодих батьків
Nowy przewodnik|New guide|Новий путівник
Dziecko w drodze? Sprawdź, co Ci przysługuje.|Baby on the way? Check what you're entitled to.|Чекаєте на дитину? Перевірте, що вам належить.
Zaplanuj formalności|Plan the formalities|Сплануйте формальності
Dla firm|For businesses|Для бізнесу
Emerytura|Retirement|Пенсія
Rodzice|Parents|Батьки
Przedsiębiorcy|Entrepreneurs|Підприємці
Załatw sprawę online|Get things done online|Вирішуйте справи онлайн
Zarezerwuj e-wizytę|Book an e-visit|Забронювати е-візит
Zadzwoń do nas|Call us|Зателефонуйте нам
Znajdź placówkę|Find an office|Знайти відділення
Najczęściej szukane|Most searched|Найчастіше шукають
Zasiłek chorobowy|Sickness benefit|Допомога з хвороби
Emerytury|Pensions|Пенсії
Firmy|Businesses|Бізнес
Pracujący|Employees|Працюючі
Lekarze|Doctors|Лікарі
Wzory formularzy|Form templates|Зразки форм
Baza wiedzy|Knowledge base|База знань
O ZUS|About ZUS|Про ZUS
Przewodnik rodzica|Parent guide|Путівник для батьків
Przewodnik młodego rodzica|Young parent guide|Путівник молодих батьків
Dla rodziców|For parents|Для батьків
Zasiłki|Benefits|Допомоги
Świadczenia dla rodzin|Family benefits|Сімейні виплати
Na skróty|Shortcuts|Швидкі посилання
Aktualności|News|Новини
O nas|About us|Про нас
Zaloguj się przez mObywatel|Log in with mObywatel|Увійти через mObywatel
Jak mogę Ci pomóc?|How can I help you?|Чим я можу допомогти?
Cześć|Hi|Привіт
Jestem ZUSanna, Twoja asystentka rodzica.|I'm ZUSanna, your parent assistant.|Я ZUSanna, ваша помічниця для батьків.
Zapytaj własnymi słowami…|Ask in your own words…|Запитайте своїми словами…
Wyślij|Send|Надіслати
Jak chcesz dostawać zasiłek?|How do you want to receive the benefit?|Як ви хочете отримувати допомогу?
100% za macierzyński, potem 70%|100% for maternity, then 70%|100% за материнство, потім 70%
81,5% przez cały rok|81.5% for the whole year|81,5% протягом усього року
81,5% wybierasz tylko we wniosku złożonym w ciągu 21 dni po porodzie. Później zostaje wariant 100% + 70%.|You can choose 81.5% only in an application filed within 21 days of birth. Later only 100% + 70% remains.|81,5% можна обрати лише в заяві, поданій протягом 21 дня після пологів. Пізніше залишається варіант 100% + 70%.
Zapisz wersję roboczą|Save draft|Зберегти чернетку
Zapisano wersję roboczą.|Draft saved.|Чернетку збережено.
Wersja robocza zapisana|Draft saved|Чернетку збережено
Wyjdź i dokończ później|Leave and finish later|Вийти й завершити пізніше
Zapisz i dokończ później|Save and finish later|Зберегти й завершити пізніше
Wersje robocze|Drafts|Чернетки
Wnioski, które zaczęłaś/zacząłeś i zapisałaś/zapisałeś na później. Nic nie zostało jeszcze wysłane.|Applications you started and saved for later. Nothing has been sent yet.|Заяви, які ви почали й зберегли на потім. Ще нічого не надіслано.
Dokończ wniosek|Finish application|Завершити заяву
Usuń|Delete|Видалити
Dziś nie masz zaległości w składkach|You have no contribution arrears today|Сьогодні у вас немає заборгованості
`;

export const SLOWNIK_DOM = {};
WIERSZE.trim().split("\n").forEach((w) => {
  const [pl, en, uk] = w.split("|");
  if (pl && en && uk) SLOWNIK_DOM[pl.trim()] = { en: en.trim(), uk: uk.trim() };
});

// ---------- teksty z liczbami i datami ----------
const MIES_PL = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca", "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];
const MIES = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  uk: ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"],
};
const SKR_PL = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];
const SKR = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  uk: ["січ", "лют", "бер", "кві", "тра", "чер", "лип", "сер", "вер", "жов", "лис", "гру"],
};
const miesiac = (m, j) => MIES[j][MIES_PL.indexOf(m)];

export const WZORCE = [
  // 9 listopada 2026
  [new RegExp(`^(\\d{1,2}) (${MIES_PL.join("|")})( \\d{4})?$`), (m, j) => (j === "en" ? `${m[1]} ${miesiac(m[2], j)}${m[3] || ""}` : `${m[1]} ${miesiac(m[2], j)}${m[3] || ""}`)],
  [new RegExp(`^(${SKR_PL.join("|")})$`), (m, j) => SKR[j][SKR_PL.indexOf(m[1])]],
  [/^(\d+) rzeczy na Twojej liście$/, (m, j) => (j === "en" ? `${m[1]} items on your list` : `${m[1]} справ у вашому списку`)],
  [/^za (\d+) dni$/, (m, j) => (j === "en" ? `in ${m[1]} days` : `через ${m[1]} днів`)],
  [/^za (\d+) mies\.$/, (m, j) => (j === "en" ? `in ${m[1]} mo.` : `через ${m[1]} міс.`)],
  [/^(\d+) dni temu$/, (m, j) => (j === "en" ? `${m[1]} days ago` : `${m[1]} днів тому`)],
  [/^Dzień (\d+) z (\d+)$/, (m, j) => (j === "en" ? `Day ${m[1]} of ${m[2]}` : `День ${m[1]} з ${m[2]}`)],
  [/^Dzień$/, (m, j) => (j === "en" ? "Day" : "День")],
  [/^(\d+(?:,\d+)?) tyg\.$/, (m, j) => (j === "en" ? `${m[1]} wks` : `${m[1]} тиж.`)],
  [/^(\d+) dni$/, (m, j) => (j === "en" ? `${m[1]} days` : `${m[1]} днів`)],
  [/^(\d+) (sprawa|sprawy|spraw)$/, (m, j) => (j === "en" ? `${m[1]} case${m[1] === "1" ? "" : "s"}` : `${m[1]} справ`)],
  [/^Powiadomienia: (\d+) bliskie terminy$/, (m, j) => (j === "en" ? `Notifications: ${m[1]} upcoming deadlines` : `Сповіщення: ${m[1]} найближчі терміни`)],
  [/^Sesja wygaśnie za (\S+)\. Kliknij, aby przedłużyć\.$/, (m, j) => (j === "en" ? `Session expires in ${m[1]}. Click to extend.` : `Сесія закінчиться через ${m[1]}. Натисніть, щоб продовжити.`)],
  [/^Masz (\d+) terminów przed sobą\..*$/, (m, j) => (j === "en" ? `You have ${m[1]} deadlines ahead. Turn on reminders — add them to your calendar from the bell at the top.` : `У вас попереду ${m[1]} термінів. Увімкніть нагадування — додайте їх до календаря через дзвіночок угорі.`)],
  [new RegExp(`^Dziś, (\\d{1,2}) (${MIES_PL.join("|")}) · (\\d+)\\. tydzień ciąży$`), (m, j) => (j === "en" ? `Today, ${m[1]} ${miesiac(m[2], j)} · week ${m[3]} of pregnancy` : `Сьогодні, ${m[1]} ${miesiac(m[2], j)} · ${m[3]}-й тиждень вагітності`)],
  [/^Poprzednie zwolnienia \($/, (m, j) => (j === "en" ? "Previous sick leave (" : "Попередні лікарняні (")],
  [/^Poprzednie zwolnienia \((\d+)\)$/, (m, j) => (j === "en" ? `Previous sick leave (${m[1]})` : `Попередні лікарняні (${m[1]})`)],
  [/^Twój pracodawca(.*)$/, (m, j) => (j === "en" ? `Your employer${m[1]}` : `Ваш роботодавець${m[1]}`)],
  [/^u pracodawcy \((.+)\)$/, (m, j) => (j === "en" ? `with the employer (${m[1]})` : `у роботодавця (${m[1]})`)],
  [/^Strona: (.+)$/, (m, j, tl) => `${j === "en" ? "Page" : "Сторінка"}: ${tl(m[1]) || m[1]}`],
  [/^(\d+) minut[ay]?$/, (m, j) => (j === "en" ? `${m[1]} min` : `${m[1]} хв`)],
  [/^Zapytaj ZUS \((\d+)\)$/, (m, j) => (j === "en" ? `Ask ZUS (${m[1]})` : `Запитати ZUS (${m[1]})`)],
  [/^Połączono · dane z (.+)$/, (m, j) => (j === "en" ? `Connected · data from ${m[1]}` : `Підключено · дані від ${m[1]}`)],
  [/^Zasiłek wypłacony za (.+)$/, (m, j) => (j === "en" ? `Benefit paid for ${m[1]}` : `Допомогу виплачено за ${m[1]}`)],
];
