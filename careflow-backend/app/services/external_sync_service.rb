require 'net/http'
require 'uri'
require 'json'

class ExternalSyncService
  EXTERNAL_API_BASE = 'https://509a1ddd-a23a-47b7-a201-24b9339c6911.mock.pstmn.io'

  def sync_all
    sync_clients
    sync_appointments
  end

  def sync_clients
    response = get('/clients')
    return unless response.is_a?(Array)
    response.each do |client_data|
      client = Client.find_or_initialize_by(external_id: client_data['id'])
      client.name = client_data['name']
      client.email = client_data['email']
      client.phone = client_data['phone']
      client.save!
    end
  end

  def sync_appointments
    response = get('/appointments')
    return unless response.is_a?(Array)
    response.each do |appt_data|
      client = Client.find_by(external_id: appt_data['client_id'])
      next unless client
      appt = Appointment.find_or_initialize_by(external_id: appt_data['id'])
      appt.client = client
      appt.scheduled_at = appt_data['time'] || appt_data['scheduled_at']
      appt.notes = appt_data['notes']
      appt.save!
    end
  end

  def create_client(client)
    response = post('/clients', {
      name: client.name,
      email: client.email,
      phone: client.phone
    })
    if response && response['id']
      client.update!(external_id: response['id'])
    end
  end

  def create_appointment(appointment)
    response = post('/appointments', {
      client_id: appointment.client.external_id,
      scheduled_at: appointment.scheduled_at,
      notes: appointment.notes
    })
    if response && response['id']
      appointment.update!(external_id: response['id'])
    end
  end

  private

  def get(path)
    uri = URI.join(EXTERNAL_API_BASE, path)
    res = Net::HTTP.get_response(uri)
    body = res.body

    # The mock API returns JSON in a 'body' key for clients
    if path == '/clients' && body.include?('body')
      body = JSON.parse(body)['body']
    end
    JSON.parse(body) if res.is_a?(Net::HTTPSuccess)
  rescue => e
    Rails.logger.error("ExternalSyncService GET error: #{e.message}")
    nil
  end

  def post(path, payload)
    uri = URI.join(EXTERNAL_API_BASE, path)
    req = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
    req.body = payload.to_json
    res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == 'https') do |http|
      http.request(req)
    end
    JSON.parse(res.body) if res.is_a?(Net::HTTPSuccess)
  rescue => e
    Rails.logger.error("ExternalSyncService POST error: #{e.message}")
    nil
  end
end
