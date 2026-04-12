<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use App\Models\Kandidati;
use App\Models\Kompania;
use App\Models\VendiPunes;
use App\Models\Aftesia;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Roles
        $adminRole   = Role::create(['emertimi' => 'Admin',   'normalized_name' => 'ADMIN',   'pershkrimi' => 'Full access']);
        $managerRole = Role::create(['emertimi' => 'Manager', 'normalized_name' => 'MANAGER', 'pershkrimi' => 'Manages operations']);
        $userRole    = Role::create(['emertimi' => 'User',    'normalized_name' => 'USER',    'pershkrimi' => 'Limited access']);

        // Admin user
        $admin = User::create([
            'emri'     => 'Admin',
            'mbiemri'  => 'User',
            'email'    => 'admin@agency.com',
            'password' => bcrypt('password'),
            'statusi'  => true,
        ]);
        $admin->roles()->attach($adminRole->id);

        // Skills
        $skills = ['PHP', 'JavaScript', 'React', 'Laravel', 'MySQL', 'Python', 'Java', 'Communication', 'Leadership'];
        foreach ($skills as $skill) {
            Aftesia::create(['emri_aftesise' => $skill, 'kategoria' => 'Tech']);
        }

        // Companies with users
        for ($i = 1; $i <= 5; $i++) {
            $user = User::create([
                'emri'     => fake()->firstName(),
                'mbiemri'  => fake()->lastName(),
                'email'    => fake()->unique()->safeEmail(),
                'password' => bcrypt('password'),
                'statusi'  => true,
            ]);
            $user->roles()->attach($managerRole->id);

            Kompania::create([
                'user_id'          => $user->id,
                'emri_kompanise'   => fake()->company(),
                'sektori'          => fake()->randomElement(['IT', 'Finance', 'Marketing', 'Healthcare']),
                'adresa'           => fake()->address(),
                'personi_kontaktit'=> fake()->name(),
                'email'            => fake()->companyEmail(),
                'telefoni'         => fake()->phoneNumber(),
                'numri_punonjesve' => fake()->numberBetween(10, 500),
            ]);
        }

        // Candidates with users
        for ($i = 1; $i <= 10; $i++) {
            $user = User::create([
                'emri'     => fake()->firstName(),
                'mbiemri'  => fake()->lastName(),
                'email'    => fake()->unique()->safeEmail(),
                'password' => bcrypt('password'),
                'statusi'  => true,
            ]);
            $user->roles()->attach($userRole->id);

            Kandidati::create([
                'user_id'       => $user->id,
                'emri'          => $user->emri,
                'mbiemri'       => $user->mbiemri,
                'email'         => $user->email,
                'telefoni'      => fake()->phoneNumber(),
                'data_lindjes'  => fake()->date(),
                'adresa'        => fake()->address(),
                'profesioni'    => fake()->jobTitle(),
                'pervoja_vite'  => fake()->numberBetween(0, 15),
            ]);
        }

        // Job positions
        $kompanitë = Kompania::all();
        foreach ($kompanitë as $kompania) {
            for ($i = 0; $i < 4; $i++) {
                VendiPunes::create([
                    'kompani_id'      => $kompania->kompani_id,
                    'titulli'         => fake()->jobTitle(),
                    'pershkrimi'      => fake()->paragraph(),
                    'kerkesat'        => fake()->sentence(),
                    'lloji_kontrates' => fake()->randomElement(['full-time', 'part-time', 'remote']),
                    'paga_min'        => fake()->numberBetween(500, 1500),
                    'paga_max'        => fake()->numberBetween(1500, 4000),
                    'lokacioni'       => fake()->city(),
                    'afati'           => fake()->dateTimeBetween('+1 month', '+6 months')->format('Y-m-d'),
                    'statusi'         => 'aktiv',
                ]);
            }
        }
    }
}
