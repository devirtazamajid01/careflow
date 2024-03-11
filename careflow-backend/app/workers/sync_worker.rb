class SyncWorker
  include Sidekiq::Worker

  def perform
    ExternalSyncService.new.sync_all
  end
end 
