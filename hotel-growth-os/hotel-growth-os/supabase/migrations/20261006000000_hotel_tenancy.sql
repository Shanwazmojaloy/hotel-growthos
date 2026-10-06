New-Item -ItemType Directory -Force -Path "supabase/migrations"
Get-Clipboard | Out-File -FilePath "supabase/migrations/20261006000000_hotel_tenancy.sql" -Encoding utf8
