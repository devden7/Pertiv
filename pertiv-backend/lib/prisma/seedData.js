const generateBorrowId = require('../../utils/randomBorrowId');
const generateReturnedBooknKey = require('../../utils/randomReturnedBookKey');
const generateLoanKey = require('../../utils/randomLoanKey');
const { formatISO, subDays, addDays } = require('date-fns');
const prisma = require('../../utils/prismaConnection');
const bcrypt = require('bcryptjs');
const generateOrderKey = require('../../utils/randomOrderKey');
const generateOrderId = require('../../utils/randomOrderId');

//UTILS
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPrice(min = 1000, max = 200000) {
  const minThousands = Math.ceil(min / 1000);
  const maxThousands = Math.floor(max / 1000);
  const randomThousands = getRandomInt(minThousands, maxThousands);
  return randomThousands * 1000;
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 20);
}

function randomBoolean() {
  return Math.random() < 0.5;
}

function randomDateWithinPast30Days() {
  const daysAgo = Math.floor(Math.random() * 30) + 1;
  return subDays(new Date(), daysAgo);
}

function randomArrayElement(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

function randomDateBetween(start, end) {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime);
}

const create100StaffAccount = async () => {
  console.log('START CREATING ACCOUNTS STAFF...');
  const firstNames = [
    'Dina',
    'Adi',
    'Rina',
    'Budi',
    'Sari',
    'Andi',
    'Wulan',
    'Rafi',
    'Lia',
    'Fajar',
    'Nina',
    'Rian',
    'Yuni',
    'Ilham',
    'Tia',
    'Reza',
    'Dewi',
    'Agus',
    'Nanda',
    'Putri',
  ];

  const lastNames = [
    'Saputra',
    'Wijaya',
    'Pratama',
    'Susanto',
    'Siregar',
    'Kurniawan',
    'Utami',
    'Hidayat',
    'Lestari',
    'Rahman',
    'Nurhaliza',
    'Mahendra',
    'Syahputra',
    'Anggraini',
    'Febrianto',
    'Ramadhani',
    'Santoso',
    'Permata',
    'Setiawan',
    'Cahyani',
  ];

  const staffUsers = Array.from({ length: 100 }).map((_, i) => {
    const id = `staff${String(i + 1).padStart(3, '0')}`;
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${first} ${last}`;
    const email = `${id}@test.com`;
    const defaultPassword = bcrypt.hashSync('123456', 10);

    return {
      id,
      name,
      email,
      password: defaultPassword,
      role: 'staff',
      is_deleted: false,
    };
  });

  await prisma.user.createMany({
    data: staffUsers,
    skipDuplicates: true,
  });

  console.log('2. STAFF ACCOUNT CREATED SUCCESSFULLY...');
};

async function resetAllTables() {
  console.log('RESETTING ALL TABLES');
  await prisma.membershipTransaction.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.penalty.deleteMany();
  await prisma.itemBorrowed.deleteMany();
  await prisma.bookBorrowed.deleteMany();
  await prisma.collectionItem.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.bookBorrowed.deleteMany();
  await prisma.itemOrder.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.bookCategoryBorrow.deleteMany();
  await prisma.bookCategorySell.deleteMany();
  await prisma.bookBorrowing.deleteMany();
  await prisma.bookSelling.deleteMany();
  await prisma.writer.deleteMany();
  await prisma.publisher.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany({
    where: {
      role: 'user',
    },
  });
  await prisma.user.deleteMany({
    where: {
      role: 'staff',
    },
  });
  console.log('1. TABLES RESET COMPLETE...');
}

const createBooks = async () => {
  console.log('START CREATING BOOKS...');
  const categories = [
    'Tech',
    'Comedy',
    'Self Development',
    'Romance',
    'Drama',
    'Action',
    'Biography',
    'History',
    'Philosophy',
    'Mystery',
  ];

  const writers = [
    'Tere Liye',
    'Andrea Hirata',
    'Raditya Dika',
    'Habiburrahman El Shirazy',
    'Dewi Lestari',
    'Fiersa Besari',
    'Asma Nadia',
    'Sapardi Djoko Damono',
    'B.J. Habibie',
    'Felix Siauw',
  ];

  const publishers = [
    'Gramedia',
    'Bentang Pustaka',
    'Mizan',
    'Erlangga',
    'GagasMedia',
    'Bukune',
    'Visi Media',
    'GPU',
    'AgroMedia',
    'Kompas',
  ];

  const sellBookTitles = [
    'Machine age',
    'Bumi Manusia',
    'Perahu Kertas',
    'Negeri 5 Menara',
    'The Mountain Is You',
    'Koala Kumal',
    'Cinta Brontosaurus',
    'Sang Pemimpi',
    'Hujan',
    'Laut Bercerita',
    'Filosofi Teras',
    'Atomic Habits',
    'Rich Dad Poor Dad',
    'Sapiens',
    'The Psychology of Money',
    'Clean Code',
    'You Don’t Know JS',
    'JavaScript: The Good Parts',
    'Eloquent JavaScript',
    'Hacktivate Yourself',
    'Senyum Kode',
    'Critical Eleven',
    'Thinking Fast And Slow',
    'The Power Of habit',
    'Habits of highly productive people',
  ];

  const borrowBookTitles = [
    'Tenggelamnya Kapal Van Der Wijck',
    'Orang-Orang Biasa',
    'Tentang Kamu',
    'Negeri Para Bedebah',
    'Garis Waktu',
    'Think Again',
    'The Power Of Now',
    'Zero to One',
    'Start With Why',
    'The Subtle Art of Not Giving a F*ck',
    'Antologi Rasa',
    'Love Sparks in Korea',
    'Mariposa',
    'Anak Semua Bangsa',
    'Partikel',
    'Rectoverso',
    'Bulan',
    'Melbourne: Rewind',
    'Surat Kecil untuk Tuhan',
    'Indigo Tapi Penakut',
    'KKN di desa penari',
    'Sunset Bersama Rosie',
    'Assalamualaikum Beijing',
    'Sang Pemimpi Reborn',
    'Langit Merah Putih',
  ];

  await prisma.category.createMany({
    data: categories.map((name) => ({ name })),
    skipDuplicates: true,
  });

  await prisma.publisher.createMany({
    data: publishers.map((name) => ({ name })),
    skipDuplicates: true,
  });

  await prisma.writer.createMany({
    data: writers.map((name) => ({ name })),
    skipDuplicates: true,
  });

  const categoryData = await prisma.category.findMany();
  const publisherData = await prisma.publisher.findMany();
  const writerData = await prisma.writer.findMany();
  const staffUsers = await prisma.user.findMany({
    where: { role: 'staff', is_deleted: false },
  });

  const sellBooks = [];
  const borrowBooks = [];

  for (let i = 0; i < 25; i++) {
    const title = sellBookTitles[i];
    const genre = getRandomItem(categories);
    const description = `Buku populer berjudul "${title}" bergenre ${genre}.`;
    const language = 'Indonesia';
    const stock = getRandomInt(50, 100);
    const customId = `book-${slugify(title)}-${i + 1}`;

    const user = getRandomItem(staffUsers);
    const publisher = getRandomItem(publisherData);
    const writer = getRandomItem(writerData);

    const categoryObj = categoryData.find(
      (c) => c.name.toLowerCase() === genre.toLowerCase()
    );
    if (!categoryObj) continue;

    const categoryConnect = {
      create: [
        {
          categories: {
            connect: { name: categoryObj.name },
          },
        },
      ],
    };

    if (i < 25) {
      sellBooks.push(
        prisma.bookSelling.create({
          data: {
            id: customId,
            title: title.toLowerCase(),
            description,
            language: language.toLowerCase(),
            stock,
            price: getRandomPrice(),
            imageUrl: null,
            user_id: user.id,
            publisher_id: publisher.id,
            writer_id: writer.id,
            category: categoryConnect,
          },
        })
      );
    }
  }

  for (let i = 0; i < 25; i++) {
    const title = borrowBookTitles[i];
    const genre = getRandomItem(categories);
    const description = `Buku populer berjudul "${title}" bergenre ${genre}.`;
    const language = 'Indonesia';
    const imageUrl = null;
    const stock = getRandomInt(5, 15);
    const customId = `book-${slugify(title)}-${i + 26}`;

    const user = getRandomItem(staffUsers);
    const publisher = getRandomItem(publisherData);
    const writer = getRandomItem(writerData);

    const categoryObj = categoryData.find(
      (c) => c.name.toLowerCase() === genre.toLowerCase()
    );
    if (!categoryObj) continue;

    const categoryConnect = {
      create: [
        {
          categories: {
            connect: { name: categoryObj.name },
          },
        },
      ],
    };

    borrowBooks.push(
      prisma.bookBorrowing.create({
        data: {
          id: customId,
          title: title.toLowerCase(),
          description,
          book_position: `rak-${getRandomInt(1, 10)}`,
          language: language.toLowerCase(),
          stock,
          is_member: Math.random() < 0.7,
          imageUrl,
          user_id: user.id,
          publisher_id: publisher.id,
          writer_id: writer.id,
          category: categoryConnect,
        },
      })
    );
  }

  await Promise.all([...sellBooks, ...borrowBooks]);

  console.log('3. THE BOOKS HAS BEEN ADDED SUCCESSFULLY...');
};

async function seedUsers() {
  console.log('START CREATING ACCOUNTS USER...');
  const existingStaffs = await prisma.user.findMany({
    where: { role: 'staff' },
  });
  const staffNamesLower = existingStaffs.map((user) => user.name.toLowerCase());

  const firstNames = [
    'Alya',
    'Bima',
    'Citra',
    'Dimas',
    'Elin',
    'Farhan',
    'Gita',
    'Haris',
    'Intan',
    'Jaka',
    'Kiki',
    'Laras',
    'Made',
    'Nina',
    'Ojan',
    'Putri',
    'Qori',
    'Raka',
    'Sari',
    'Tian',
    'Udin',
    'Vina',
    'Wira',
    'Xena',
    'Yudha',
    'Zara',
    'Agus',
    'Bella',
    'Cahya',
    'Dewi',
    'Eko',
    'Fani',
    'Galih',
    'Hilda',
    'Imam',
    'Jeni',
    'Kamal',
    'Lina',
    'Mira',
    'Niko',
    'Oki',
    'Pipit',
    'Qila',
    'Roni',
    'Sinta',
    'Tono',
    'Umi',
    'Vira',
    'Wulan',
    'Zaki',
  ];

  const lastNames = [
    'Pratama',
    'Saputra',
    'Wijaya',
    'Lestari',
    'Santoso',
    'Nugroho',
    'Wibowo',
    'Susanti',
    'Putra',
    'Siregar',
    'Gunawan',
    'Syahputra',
    'Maulana',
    'Rahmawati',
    'Kusuma',
    'Firmansyah',
    'Ramadhan',
    'Permata',
    'Utami',
    'Yuliani',
    'Nuraini',
    'Anggraini',
    'Fauziah',
    'Setiawan',
    'Hidayat',
    'Azizah',
    'Ardiansyah',
    'Fitriani',
    'Saputri',
    'Hardiansyah',
    'Sasmita',
    'Wardhani',
    'Puspitasari',
    'Ramadhani',
    'Salsabila',
    'Fadilah',
    'Sundari',
    'Halimah',
    'Afifah',
    'Iskandar',
    'Handayani',
    'Malik',
    'Surya',
    'Andini',
    'Rosidah',
    'Habibah',
    'Anjani',
    'Nabilah',
    'Yuliana',
    'Putri',
  ];

  const newUsers = [];
  let count = 0;
  let index = 0;

  while (count < 50 && index < firstNames.length) {
    const name = `${firstNames[index]} ${lastNames[index]}`;
    const nameLower = name.toLowerCase();

    const isDuplicate = staffNamesLower.find(
      (staffName) => staffName === nameLower
    );
    if (!isDuplicate) {
      const id = `user${String(count + 1).padStart(3, '0')}`;
      const email = `${id}@test.com`;

      newUsers.push(
        prisma.user.create({
          data: {
            id,
            name,
            email,
            password: bcrypt.hashSync('123456', 10),
            role: 'user',
            image: null,
          },
        })
      );
      count++;
    }

    index++;
  }

  await Promise.all(newUsers);
  console.log('4. USER ACCOUNT CREATED SUCCESSFULLY...');
}

async function seedUserCarts() {
  console.log('RUNNING SEED USER CARTS');
  const users = await prisma.user.findMany({ where: { role: 'user' } });
  const books = await prisma.bookSelling.findMany();

  for (const user of users) {
    const cart = await prisma.cart.upsert({
      where: { user_id: user.id },
      update: {},
      create: { user_id: user.id },
    });

    const bookCount = getRandomInt(1, 5); // 1-5 books per user
    const selectedBooks = [];

    while (selectedBooks.length < bookCount) {
      const randomBook = getRandomItem(books);
      if (!selectedBooks.find((b) => b.id === randomBook.id)) {
        selectedBooks.push(randomBook);
      }
    }

    for (const book of selectedBooks) {
      const quantity = getRandomInt(1, 3); // 1-3 quantity per book

      await prisma.cartItem.create({
        data: {
          cart_id: cart.id,
          book_selling_id: book.id,
          quantity,
        },
      });
    }
  }

  console.log('5 Carts and cart items created for all users');
}

async function seedUserOrderWithConfirmation() {
  console.log('Running Create order and confirmation');
  const users = await prisma.user.findMany({ where: { role: 'user' } });
  const staff = await prisma.user.findMany({ where: { role: 'staff' } });

  for (const user of users) {
    const cart = await prisma.cart.findUnique({ where: { user_id: user.id } });
    if (!cart) continue;

    const cartItems = await prisma.cartItem.findMany({
      where: { cart_id: cart.id },
    });
    if (!cartItems.length) continue;

    const bookIds = cartItems.map((item) => item.book_selling_id);
    const books = await prisma.bookSelling.findMany({
      where: { id: { in: bookIds } },
    });

    const isStockSufficient = cartItems.every((item) => {
      const book = books.find((b) => b.id === item.book_selling_id);
      return book && book.stock >= item.quantity;
    });

    if (!isStockSufficient) continue;

    const totalPrice = cartItems.reduce((acc, item) => {
      const book = books.find((b) => b.id === item.book_selling_id);
      return book ? acc + book.price * item.quantity : acc;
    }, 0);

    const orderCreatedAt = randomDateWithinPast30Days();
    const endedAt = new Date(orderCreatedAt.getTime() + 24 * 60 * 60 * 1000);

    const order = await prisma.order.create({
      data: {
        id: generateOrderId(),
        userId: user.id,
        status: 'pending',
        total_price: totalPrice,
        created_at: orderCreatedAt,
        ended_at: endedAt,
        item_orders: {
          create: cartItems.map((item) => {
            const book = books.find((b) => b.id === item.book_selling_id);
            return {
              book_title: book.title,
              book_description: book.description,
              book_imageUrl: book.imageUrl,
              book_price: book.price,
              quantity: item.quantity,
              book_selling_id: book.id,
            };
          }),
        },
      },
      include: { item_orders: true },
    });

    for (const item of cartItems) {
      await prisma.bookSelling.update({
        where: { id: item.book_selling_id },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cart_id: cart.id,
        book_selling_id: { in: books.map((book) => book.id) },
      },
    });
    const randomStatus = Math.random();

    if (randomStatus < 0.3) {
      continue;
    }

    const isPaid = randomStatus < 0.65;

    if (isPaid) {
      const paidDate = randomDateBetween(orderCreatedAt, endedAt);
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'paid',
          buy_key: generateOrderKey(),
          paid_at: formatISO(paidDate),
        },
      });

      const isHandled = randomBoolean();
      if (isHandled && staff.length > 0) {
        const handler = randomArrayElement(staff);
        const buyDate = randomDateBetween(paidDate, new Date());
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'success',
            buy_handled_by: handler.email,
            buy_date: formatISO(buyDate),
          },
        });
      }
    } else {
      const isManualCancel = randomBoolean();
      const canceledAt = isManualCancel
        ? randomDateBetween(orderCreatedAt, endedAt)
        : endedAt;

      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'canceled',
          canceled_at: formatISO(canceledAt),
        },
      });

      for (const item of order.item_orders) {
        await prisma.bookSelling.update({
          where: { id: item.book_selling_id },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }
    }
  }

  console.log('6. Seed user order with confirmations done');
}

async function seedLoanCart() {
  console.log('RUNNING SEED USER LOAN CARTS');
  const users = await prisma.user.findMany({ where: { role: 'user' } });
  const books = await prisma.bookBorrowing.findMany();

  if (users.length === 0 || books.length === 0) {
    console.log('Missing required data (user/book)');
    return;
  }

  for (const user of users) {
    const collection = await prisma.collection.upsert({
      where: { user_id: user.id },
      update: {},
      create: { user_id: user.id },
    });
    const numberOfBooks = Math.floor(Math.random() * 3) + 1;

    const shuffledBooks = [...books].sort(() => 0.5 - Math.random());
    const selectedBooks = shuffledBooks.slice(0, numberOfBooks);

    for (const book of selectedBooks) {
      const existing = await prisma.collectionItem.findUnique({
        where: {
          collection_id_book_id: {
            collection_id: collection.id,
            book_id: book.id,
          },
        },
      });

      if (!existing) {
        await prisma.collectionItem.create({
          data: {
            collection_id: collection.id,
            book_id: book.id,
          },
        });
      }
    }
  }

  console.log('7. COLLECTION AND COLLECTION ITEM CREATED FOR ALL USERS');
}

async function seedBorrowedBooks() {
  console.log('START RUNNING SEED BORROWED BOOKS');
  const users = await prisma.user.findMany({ where: { role: 'user' } });
  const staff = await prisma.user.findMany({ where: { role: 'staff' } });
  const books = await prisma.bookBorrowing.findMany();

  if (!users.length || !staff || !books.length) {
    console.log('⛔ Dibutuhkan minimal 1 staff, 1 user, dan 1 buku.');
    return;
  }
  const statuses = [
    'pending',
    'accepted',
    'canceled',
    'borrowed',
    'return req',
    'returned',
  ];

  for (const user of users) {
    const randomStatus = randomArrayElement(statuses);
    const createdAt = randomDateWithinPast30Days();
    const loanDate = addDays(createdAt, 1);
    const endedAt = addDays(loanDate, 14);
    const dateReturned = addDays(loanDate, 16);
    const canceledAt = addDays(createdAt, 2);

    const randomBook = randomArrayElement(books);
    const randomStaff = randomArrayElement(staff);

    const borrowed = await prisma.bookBorrowed.create({
      data: {
        id: generateBorrowId(),
        userId: user.id,
        status: randomStatus,
        created_at: createdAt,
        ...(randomStatus === 'accepted' ||
        randomStatus === 'borrowed' ||
        randomStatus === 'return req' ||
        randomStatus === 'returned'
          ? {
              loan_key: generateLoanKey(),
            }
          : {}),
        ...(randomStatus === 'borrowed' ||
        randomStatus === 'return req' ||
        randomStatus === 'returned'
          ? {
              loan_date: loanDate,
              loan_handled_by: randomStaff.email,
              ended_at: endedAt,
            }
          : {}),
        ...(randomStatus === 'return req' || randomStatus === 'returned'
          ? {
              returned_key: generateReturnedBooknKey(),
            }
          : {}),
        ...(randomStatus === 'returned'
          ? {
              date_returned: dateReturned,
              return_handled_by: randomStaff.email,
            }
          : {}),
        ...(randomStatus === 'canceled'
          ? {
              canceled_at: canceledAt,
            }
          : {}),
        items: {
          create: {
            book_title: randomBook.title,
            book_description: randomBook.description,
            book_imageUrl: randomBook.imageUrl,
            book_borrowing_id: randomBook.id,
          },
        },
      },
    });

    if (randomStatus === 'returned' && dateReturned > endedAt) {
      await prisma.penalty.create({
        data: {
          borrowed_id: borrowed.id,
          type: 'active',
          price: 5000,
          start_date: dateReturned,
          end_date: addDays(dateReturned, 3),
        },
      });
    }
  }

  console.log('8. SEED TRANSACTION BORRIWING ARE DONE');
}

async function seedMemberships() {
  console.log('START CREATE MEMBERSHIP PACKAGE');
  // Create membership package
  const membership = await prisma.membership.upsert({
    where: { name: 'premium' },
    update: {},
    create: {
      name: 'premium',
      description: 'Join and borrow up to 5 books',
      durationDays: 90,
      maxBorrow: 5,
      maxReturn: 60,
      price: 9900,
    },
  });

  const users = await prisma.user.findMany({ where: { role: 'user' } });

  for (const user of users) {
    if (!randomBoolean()) continue;

    const startDate = randomDateWithinPast30Days(30);
    const endDate = addDays(startDate, membership.durationDays);

    await prisma.membershipTransaction.create({
      data: {
        name: membership.name,
        status: 'active',
        description: membership.description,
        durationDays: membership.durationDays,
        maxBorrow: membership.maxBorrow,
        maxReturn: membership.maxReturn,
        price: membership.price,
        user_id: user.id,
        membership_id: membership.id,
        start_date: startDate,
        end_date: endDate,
      },
    });
  }

  console.log('9. SEED MEMBERSHIP CREATED SUCCESSFULLY');
}

const main = async () => {
  //1. reset all tables
  await resetAllTables();

  //2. create account staff
  await create100StaffAccount();

  //3. create books
  await createBooks();

  //4. create account user
  await seedUsers();

  //5. add book to cart
  await seedUserCarts();

  //6.  create order with confrim
  await seedUserOrderWithConfirmation();

  //7. add book to loan
  await seedLoanCart();

  //8.  create borrowing book with confrim
  await seedBorrowedBooks();

  //9. create membership package
  await seedMemberships();
};

main();
