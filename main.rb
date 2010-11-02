require 'rubygems'
require 'sinatra'
require 'couchrest'

require 'config/app_config.rb'

require 'couchrest_extended_document'
require 'lib/user.rb'
require 'lib/photo.rb'

get '/' do
  haml :index
end

get '/photos' do
  content_type :json
  photos = Photo.by_standard_uri
  photos.to_json
end

get '/photo/:imageId/high_res' do
  parameter = params[:imageId]  
  photo = Photo.by_uid( :key => parameter, :limit => 1 ).first

  stop [ 404, "Page not found" ] unless defined? photo[:high_res_uri] 

  uri = 'public/files/images/clients/rachel/' 
  uri << photo[:high_res_uri]

  send_file uri, :type => 'image/jpeg', :disposition => 'attachment'
end

get '/photo/:imageId/:quality' do
  parameter = params[:imageId]  
  photo = Photo.by_uid( :key => parameter, :limit => 1 ).first

  imgQuality = params[:quality] + '_uri'
  imgVersion = imgQuality.intern
  uri = 'public/files/images/clients/rachel/' 

  stop [ 404, "Page not found" ] unless defined? photo[imgVersion] 

  uri << photo[imgVersion]
  send_file uri, :type => 'image/jpeg', :disposition => 'inline'
end

