#!/bin/sh
cp src/environments/environment.prod.ts src/environments/environment.ts
sed -i "s|#{SUPABASE_URL}#|$NG_APP_SUPABASE_URL|g" src/environments/environment.prod.ts
sed -i "s|#{SUPABASE_KEY}#|$NG_APP_SUPABASE_KEY|g" src/environments/environment.prod.ts
ng build
