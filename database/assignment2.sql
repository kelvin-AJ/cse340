-- Create Tony Stark's Account

INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
);


-- UPDATE TONY'S ACCOUNT TYPE
UPDATE account SET account_type = 'Admin' WHERE account_id = 1;

-- DELETE TONY STARK
DELETE FROM account where account_id = 1;

-- UPDATE HUMMER DESCIPTION INFORMATION
UPDATE inventory SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior') WHERE inv_model = 'Hummer';


--  SELECTT SPORT CARS USING INNER JOIN (INVENTORY AND CLASSIFICATION TABELS)
SELECT inv_make, inv_model, inventory.classification_id, classification_name FROM inventory INNER JOIN classification ON inventory.classification_id = classification.classification_id WHERE inventory.classification_id = 2;

-- UPDATE IMAGE AND THUMBNAIL URL
UPDATE inventory SET inv_image = REPLACE(inv_image, 'images/', 'images/vehicles/'),inv_thumbnail = REPLACE(inv_thumbnail, 'images/', 'images/vehicles/')

-- ADD FAVORITE(BOOLEAN) COLUMN TO INVENTORY TABLE 
ALTER TABLE inventory
ADD favourite BOOLEAN default FALSE;