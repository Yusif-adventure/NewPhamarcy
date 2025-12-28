-- Update all pharmacies that don't have a location to a default location
-- This is just for testing so you can see the distance calculation work.
-- You should ideally set the location via the app for each pharmacy.

UPDATE public.pharmacies
SET latitude = 5.6037, longitude = -0.1870 -- Example coordinates
WHERE latitude IS NULL;
