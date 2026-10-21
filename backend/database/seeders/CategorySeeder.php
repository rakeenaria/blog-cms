<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        DB::table('post_category')->truncate();
        DB::table('categories')->truncate();
        Schema::enableForeignKeyConstraints();

        $categories = [
            ['name' => 'Technology',  'description' => 'Posts about technology, programming, and software development.'],
            ['name' => 'Travel',      'description' => 'Explore exciting destinations and travel guides worldwide.'],
            ['name' => 'Food',        'description' => 'Delicious recipes, restaurant reviews, and culinary tips.'],
            ['name' => 'Health',      'description' => 'Practical advice for physical and mental wellness.'],
            ['name' => 'Business',    'description' => 'Insights into entrepreneurship, finance, and career growth.'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }
    }
}

