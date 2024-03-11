class ApplicationController < ActionController::API
  rescue_from ActionController::ParameterMissing, with: :render_bad_request

  private

  def render_bad_request(exception)
    render json: { error: exception.message }, status: :bad_request
  end

  # Simple, safe pagination without external gems
  def pagination_params
    page = params[:page].to_i
    per_page = params[:per_page].to_i
    page = 1 if page <= 0
    per_page = 20 if per_page <= 0
    per_page = 100 if per_page > 100
    { page: page, per_page: per_page }
  end

  def paginate(scope)
    page = pagination_params[:page]
    per_page = pagination_params[:per_page]
    collection = scope.limit(per_page).offset((page - 1) * per_page)
    [collection, page, per_page]
  end
end
