INSERT INTO claims (
    item_id,
    claimed_by,
    claim_message,
    claim_status
)
VALUES
(
    2,
    5,
    'This is my phone. I can unlock it and describe the wallpaper.',
    'pending'
),
(
    1,
    7,
    'The wallet contains my driving license and ATM card.',
    'approved'
),
(
    3,
    5,
    'The backpack contains my OS textbook and laptop charger.',
    'pending'
),
(
    5,
    8,
    'The calculator belongs to me. My name is written inside the cover.',
    'rejected'
);