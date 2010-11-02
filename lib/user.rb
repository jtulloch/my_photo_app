require 'uuid'

class User < CouchRest:: ExtendedDocument
  use_database DB

  property :uid, :read_only => true
  property :email
  property :first_name
  property :last_name

  set_callback :save, :before, :generate_uid

  def generate_uid
    uuid = UUID.new
    self['uid'] = uuid.generate :compact
  end
end
