class Client < ApplicationRecord
  has_many :appointments, dependent: :destroy
  validates :name, :email, :phone, presence: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
end
