class Appointment < ApplicationRecord
  belongs_to :client
  validates :client_id, :scheduled_at, presence: true
  # Prevent two appointments at the exact same date & time
  validates :scheduled_at, uniqueness: true
end
