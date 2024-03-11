require 'rufus-scheduler'

scheduler = Rufus::Scheduler.new

scheduler.every '10m' do
  Rails.logger.info "Simulating periodic sync at #{Time.now}"
  # Add any additional sync logic here
end 
