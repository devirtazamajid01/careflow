class AddExternalIdToClientsAndAppointments < ActiveRecord::Migration[7.1]
  def change
    add_column :clients, :external_id, :string
    add_index :clients, :external_id
    add_column :appointments, :external_id, :string
    add_index :appointments, :external_id
  end
end
