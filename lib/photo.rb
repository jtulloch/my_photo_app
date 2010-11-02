require 'uuid'

class Photo < CouchRest:: ExtendedDocument
  use_database DB

  property :date
  property :title
  property :tags, :cast_as => ['String']

  property :thumb_uri
  property :standard_uri
  property :high_res_uri
  timestamps!

  view_by :created_at, :descending => true
  view_by :standard_uri 
  view_by :uid
  view_by :user_id, :date


  view_by :tags,
  :map => 
    "function(doc) {
      if (doc['couchrest-type'] == 'Prediction' && doc.tags) {
        doc.tags.forEach(function(tag){
          emit(tag, 1);
        });
      }
    }",
  :reduce => 
    "function(keys, values, rereduce) {
      return sum(values);
    }"  

  set_callback :save, :before, :generate_uid

  def generate_uid
    uuid = UUID.new
    self['uid'] = uuid.generate :compact
  end
end
