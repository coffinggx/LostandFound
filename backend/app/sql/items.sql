INSERT IGNORE INTO categories (category_name)
VALUES
    ('Bag'),
    ('ID Card'),
    ('Electronics'),
    ('Bottle'),
    ('Wallet'),
    ('Other');

INSERT INTO items (
    title,
    description,
    item_type,
    category_id,
    image_url,
    location,
    date_lost_found,
    status,
    approval,
    posted_by
)
VALUES
(
    'Black Wallet',
    'Lost a black leather wallet near the library.',
    'lost',
    (SELECT category_id FROM categories WHERE category_name = 'Wallet'),
    NULL,
    'Central Library',
    '2026-08-01 10:30:00',
    'open',
    'approved',
    5
),
(
    'iPhone 14',
    'Found an iPhone 14 in the cafeteria.',
    'found',
    (SELECT category_id FROM categories WHERE category_name = 'Electronics'),
    NULL,
    'College Cafeteria',
    '2026-08-02 12:15:00',
    'open',
    'approved',
    7
),
(
    'Blue Backpack',
    'Lost blue backpack containing notebooks.',
    'lost',
    (SELECT category_id FROM categories WHERE category_name = 'Bag'),
    NULL,
    'Block B',
    '2026-08-03 09:00:00',
    'claimed',
    'approved',
    8
),
(
    'Student ID Card',
    'Found student ID near the parking area.',
    'found',
    (SELECT category_id FROM categories WHERE category_name = 'ID Card'),
    NULL,
    'Parking Lot',
    '2026-08-02 15:45:00',
    'returned',
    'approved',
    5
),
(
    'Calculator',
    'Scientific calculator left in classroom.',
    'found',
    (SELECT category_id FROM categories WHERE category_name = 'Electronics'),
    NULL,
    'Room 305',
    '2026-08-03 11:20:00',
    'open',
    'pending',
    7
);