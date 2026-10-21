<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        DB::table('users')->truncate();
        Schema::enableForeignKeyConstraints();

        User::create([
            'name'     => 'Admin User',
            'email'    => 'admin@blog.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        User::create([
            'name'     => 'Author One',
            'email'    => 'author1@blog.com',
            'password' => Hash::make('password'),
            'role'     => 'author',
        ]);

        User::create([
            'name'     => 'Author Two',
            'email'    => 'author2@blog.com',
            'password' => Hash::make('password'),
            'role'     => 'author',
        ]);
    }
}

