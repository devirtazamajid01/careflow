require 'sidekiq'
require 'sidekiq-scheduler'

Sidekiq.configure_server do |config|
  # Sidekiq-scheduler will automatically load the schedule from sidekiq.yml
end

Sidekiq.configure_client do |config|
  # Client configuration if needed
end 
