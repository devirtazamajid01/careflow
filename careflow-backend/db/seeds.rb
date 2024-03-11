# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Seed data for 100 clients
Client.create!(name: "Alice Smith", email: "alice@example.com", phone: "123-456-7890")
Client.create!(name: "Bob Jones", email: "bob@example.com", phone: "987-654-3210")
Client.create!(name: "Charlie Brown", email: "charlie@example.com", phone: "555-123-4567")
Client.create!(name: "Diana Prince", email: "diana@example.com", phone: "111-222-3333")
Client.create!(name: "Ethan Hunt", email: "ethan@example.com", phone: "444-555-6666")
Client.create!(name: "Fiona Green", email: "fiona@example.com", phone: "777-888-9999")
Client.create!(name: "George Washington", email: "george@example.com", phone: "222-333-4444")
Client.create!(name: "Hannah Thompson", email: "hannah@example.com", phone: "666-777-8888")
Client.create!(name: "Isaac Johnson", email: "isaac@example.com", phone: "333-444-5555")
Client.create!(name: "Julia Roberts", email: "julia@example.com", phone: "888-999-0000")
Client.create!(name: "Kevin Parker", email: "kevin@example.com", phone: "999-888-7777")
Client.create!(name: "Laura King", email: "laura@example.com", phone: "123-789-4560")
Client.create!(name: "Michael Scott", email: "michael@example.com", phone: "555-666-7777")
Client.create!(name: "Natalie Brooks", email: "natalie@example.com", phone: "444-222-1111")
Client.create!(name: "Oliver Stone", email: "oliver@example.com", phone: "777-333-2222")
Client.create!(name: "Paula Adams", email: "paula@example.com", phone: "101-202-3030")
Client.create!(name: "Quentin Blake", email: "quentin@example.com", phone: "404-505-6060")
Client.create!(name: "Rachel Green", email: "rachel@example.com", phone: "707-808-9090")
Client.create!(name: "Samuel Lee", email: "samuel@example.com", phone: "212-343-4545")
Client.create!(name: "Tina Turner", email: "tina@example.com", phone: "565-676-7878")

# Seed 100 appointments
Appointment.create!(client: Client.first, scheduled_at: 1.day.ago)
Appointment.create!(client: Client.second, scheduled_at: 2.days.ago)
Appointment.create!(client: Client.third, scheduled_at: 3.days.ago)
Appointment.create!(client: Client.fourth, scheduled_at: 4.days.ago)
Appointment.create!(client: Client.fifth, scheduled_at: 5.days.ago)
Appointment.create!(client: Client.offset(5).first, scheduled_at: 6.days.ago)
Appointment.create!(client: Client.offset(6).first, scheduled_at: 7.days.ago)
Appointment.create!(client: Client.offset(7).first, scheduled_at: 8.days.ago)
Appointment.create!(client: Client.offset(8).first, scheduled_at: 9.days.ago)
Appointment.create!(client: Client.offset(9).first, scheduled_at: 10.days.ago)
Appointment.create!(client: Client.offset(10).first, scheduled_at: 11.days.ago)
Appointment.create!(client: Client.offset(11).first, scheduled_at: 12.days.ago)
Appointment.create!(client: Client.offset(12).first, scheduled_at: 13.days.ago)
Appointment.create!(client: Client.offset(13).first, scheduled_at: 14.days.ago)
Appointment.create!(client: Client.offset(14).first, scheduled_at: 15.days.ago)
Appointment.create!(client: Client.offset(15).first, scheduled_at: 16.days.ago)
Appointment.create!(client: Client.offset(16).first, scheduled_at: 17.days.ago)
Appointment.create!(client: Client.offset(17).first, scheduled_at: 18.days.ago)
Appointment.create!(client: Client.offset(18).first, scheduled_at: 19.days.ago)
Appointment.create!(client: Client.offset(19).first, scheduled_at: 20.days.ago)
Appointment.create!(client: Client.offset(20).first, scheduled_at: 21.days.ago)
Appointment.create!(client: Client.offset(21).first, scheduled_at: 22.days.ago)
Appointment.create!(client: Client.offset(22).first, scheduled_at: 23.days.ago)
Appointment.create!(client: Client.offset(23).first, scheduled_at: 24.days.ago)
Appointment.create!(client: Client.offset(24).first, scheduled_at: 25.days.ago)
Appointment.create!(client: Client.offset(25).first, scheduled_at: 26.days.ago)
Appointment.create!(client: Client.offset(26).first, scheduled_at: 27.days.ago)
Appointment.create!(client: Client.offset(27).first, scheduled_at: 28.days.ago)
Appointment.create!(client: Client.offset(28).first, scheduled_at: 29.days.ago)
Appointment.create!(client: Client.offset(29).first, scheduled_at: 30.days.ago)
