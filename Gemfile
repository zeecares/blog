source "https://rubygems.org"

# This is the default theme for new Jekyll sites.
gem "minima"

# GitHub Pages
gem "github-pages", group: :jekyll_plugins

# GitHub Pages whitelisted plugins only
group :jekyll_plugins do
  gem "jekyll-feed"
  gem 'jekyll-seo-tag'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
install_if -> { RUBY_PLATFORM =~ %r!mingw|mswin|java! } do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.0", :install_if => Gem.win_platform?