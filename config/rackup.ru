require File.dirname(__FILE__) + "/../main.rb"

set :app_file, File.expand_path(File.dirname(__FILE__) + '/../main.rb')
set :public,   File.expand_path(File.dirname(__FILE__) + '/../public')
set :views,    File.expand_path(File.dirname(__FILE__) + '/../views')
set :haml,     {:format => :html5 } 
set :env,      :production
set :port,     4569

disable :run, :reload

run Sinatra::Application
