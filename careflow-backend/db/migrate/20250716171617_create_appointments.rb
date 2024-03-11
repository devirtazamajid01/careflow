class CreateAppointments < ActiveRecord::Migration[7.1]
  def change
    create_table :appointments do |t|
      t.references :client, null: false, foreign_key: true
      t.datetime :scheduled_at
      t.text :notes

      t.timestamps
    end
  end
end
