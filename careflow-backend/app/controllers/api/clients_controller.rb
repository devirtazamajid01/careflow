class Api::ClientsController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

  def index
    scope = Client.order(:name)
    collection, page, per_page = paginate(scope)
    render json: { data: collection, meta: { page: page, per_page: per_page, total: scope.count } }
  end

  def create
    client = Client.new(client_params)
    if client.save
      ExternalSyncService.new.create_client(client)
      render json: client, status: :created
    else
      render json: { errors: client.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def client_params
    params.require(:client).permit(:name, :email, :phone)
  end

  def record_not_found
    render json: { error: 'Client not found' }, status: :not_found
  end
end 
